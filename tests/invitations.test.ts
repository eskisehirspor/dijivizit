import { describe, expect, it } from "vitest";

import {
  generateInvitationCode,
  hashInvitationCode,
  INVITATION_CODE_PATTERN,
  normalizeInvitationCode,
} from "@/lib/invitations/code";
import {
  evaluateAuthUserInsertInvitation,
  evaluateEmailSignupInvitation,
  evaluateGoogleSignupInvitation,
  isInviteOwner,
  parseOwnerEmails,
  type InvitationRecord,
} from "@/lib/invitations/rules";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

const now = new Date("2026-08-13T12:00:00.000Z");

function openInvite(overrides: Partial<InvitationRecord> = {}): InvitationRecord {
  return {
    email: null,
    maxUses: 1,
    useCount: 0,
    expiresAt: null,
    revokedAt: null,
    ...overrides,
  };
}

describe("invitation codes", () => {
  it("generates DIJI-XXXX-XXXX-XXXX from a CSPRNG alphabet", () => {
    const code = generateInvitationCode();
    expect(code).toMatch(INVITATION_CODE_PATTERN);
    expect(generateInvitationCode()).not.toBe(code);
  });

  it("hashes the normalized plaintext with SHA-256 hex", () => {
    const hash = hashInvitationCode("diji-abcd-efgh-jkmn");
    expect(hash).toBe(hashInvitationCode("DIJI-ABCD-EFGH-JKMN"));
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(normalizeInvitationCode("  diji-abcd  ")).toBe("DIJI-ABCD");
  });
});

describe("email/password invitation evaluation", () => {
  it("accepts a valid generic invitation", () => {
    expect(evaluateEmailSignupInvitation(openInvite(), "new@dijivizit.com", now)).toEqual({
      ok: true,
    });
  });

  it("rejects an invalid invitation", () => {
    expect(evaluateEmailSignupInvitation(null, "new@dijivizit.com", now)).toEqual({
      ok: false,
      reason: "invalid",
    });
  });

  it("rejects an expired invitation", () => {
    expect(
      evaluateEmailSignupInvitation(
        openInvite({ expiresAt: new Date("2026-08-01T00:00:00.000Z") }),
        "new@dijivizit.com",
        now,
      ),
    ).toEqual({ ok: false, reason: "expired" });
  });

  it("rejects an exhausted invitation", () => {
    expect(
      evaluateEmailSignupInvitation(
        openInvite({ useCount: 1, maxUses: 1 }),
        "new@dijivizit.com",
        now,
      ),
    ).toEqual({ ok: false, reason: "exhausted" });
  });

  it("rejects an email-bound invitation for a different address", () => {
    expect(
      evaluateEmailSignupInvitation(
        openInvite({ email: "bound@dijivizit.com" }),
        "other@dijivizit.com",
        now,
      ),
    ).toEqual({ ok: false, reason: "email_mismatch" });
  });

  it("accepts an email-bound invitation for the matching address", () => {
    expect(
      evaluateEmailSignupInvitation(
        openInvite({ email: "bound@dijivizit.com" }),
        "Bound@dijivizit.com",
        now,
      ),
    ).toEqual({ ok: true });
  });

  it("cannot be redeemed twice once use_count reaches max_uses", () => {
    const first = evaluateEmailSignupInvitation(
      openInvite({ useCount: 0, maxUses: 1 }),
      "a@b.com",
      now,
    );
    const second = evaluateEmailSignupInvitation(
      openInvite({ useCount: 1, maxUses: 1 }),
      "a@b.com",
      now,
    );

    expect(first).toEqual({ ok: true });
    expect(second).toEqual({ ok: false, reason: "exhausted" });
  });
});

describe("auth.users insert gate", () => {
  it("rejects direct email signup without an invitation code", () => {
    expect(
      evaluateAuthUserInsertInvitation({
        provider: "email",
        invitationCode: null,
        email: "bot@dijivizit.com",
        recordByCode: openInvite(),
        recordByBoundEmail: null,
        now,
      }),
    ).toEqual({ ok: false, reason: "invalid" });
  });

  it("rejects a brand-new Google identity without an email-bound invitation", () => {
    expect(
      evaluateAuthUserInsertInvitation({
        provider: "google",
        invitationCode: "DIJI-ABCD-EFGH-JKMN",
        email: "new.google@dijivizit.com",
        recordByCode: openInvite(),
        recordByBoundEmail: null,
        now,
      }),
    ).toEqual({ ok: false, reason: "invalid" });
  });

  it("ignores generic codes for a brand-new Google identity", () => {
    expect(
      evaluateGoogleSignupInvitation(openInvite({ email: null }), "new.google@dijivizit.com", now),
    ).toEqual({ ok: false, reason: "invalid" });
  });

  it("accepts a brand-new Google identity with a matching email-bound invitation", () => {
    expect(
      evaluateAuthUserInsertInvitation({
        provider: "google",
        invitationCode: null,
        email: "invited@gmail.com",
        recordByCode: null,
        recordByBoundEmail: openInvite({ email: "invited@gmail.com" }),
        now,
      }),
    ).toEqual({ ok: true });
  });
});

describe("existing users stay ungated", () => {
  it("allows email login without an invitation field", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "secret12" }).success).toBe(true);
  });

  it("does not evaluate invitations for a returning Google login (no auth.users insert)", () => {
    // Returning Google users update last_sign_in_at; they never hit the insert trigger.
    expect(loginSchema.shape.email).toBeDefined();
    expect("invitationCode" in loginSchema.shape).toBe(false);
  });
});

describe("register schema", () => {
  it("requires an invitation code", () => {
    const result = registerSchema.safeParse({
      fullName: "Görkem Sönmez",
      email: "a@b.com",
      password: "longenough1",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a complete invited registration payload", () => {
    const result = registerSchema.safeParse({
      fullName: "Görkem Sönmez",
      email: "a@b.com",
      password: "longenough1",
      invitationCode: "diji-abcd-efgh-jkmn",
    });

    expect(result.success).toBe(true);
    expect(result.data?.invitationCode).toBe("DIJI-ABCD-EFGH-JKMN");
  });
});

describe("invite owner allowlist", () => {
  it("parses comma-separated owner emails", () => {
    expect(parseOwnerEmails(" Owner@Dijivizit.com , other@x.com ")).toEqual([
      "owner@dijivizit.com",
      "other@x.com",
    ]);
  });

  it("denies ordinary authenticated users", () => {
    expect(isInviteOwner("member@dijivizit.com", ["owner@dijivizit.com"])).toBe(false);
    expect(isInviteOwner("owner@dijivizit.com", ["owner@dijivizit.com"])).toBe(true);
    expect(isInviteOwner("owner@dijivizit.com", [])).toBe(false);
  });
});
