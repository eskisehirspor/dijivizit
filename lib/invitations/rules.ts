import { normalizeInvitationEmail } from "@/lib/invitations/code";

export type InvitationRecord = {
  email: string | null;
  maxUses: number;
  useCount: number;
  expiresAt: Date | null;
  revokedAt: Date | null;
};

export type InvitationFailure = "invalid" | "expired" | "exhausted" | "email_mismatch";

export type InvitationDecision =
  | { ok: true }
  | { ok: false; reason: InvitationFailure };

function isExpired(record: InvitationRecord, now: Date): boolean {
  return record.expiresAt !== null && record.expiresAt.getTime() <= now.getTime();
}

function isRevoked(record: InvitationRecord): boolean {
  return record.revokedAt !== null;
}

function isExhausted(record: InvitationRecord): boolean {
  return record.useCount >= record.maxUses;
}

/**
 * Email/password signup: lookup was by code hash. Generic (unbound) codes are
 * allowed; bound codes must match the signup address.
 */
export function evaluateEmailSignupInvitation(
  record: InvitationRecord | null,
  signupEmail: string,
  now: Date = new Date(),
): InvitationDecision {
  if (!record) {
    return { ok: false, reason: "invalid" };
  }

  if (isRevoked(record)) {
    return { ok: false, reason: "invalid" };
  }

  if (isExpired(record, now)) {
    return { ok: false, reason: "expired" };
  }

  if (isExhausted(record)) {
    return { ok: false, reason: "exhausted" };
  }

  if (record.email && record.email !== normalizeInvitationEmail(signupEmail)) {
    return { ok: false, reason: "email_mismatch" };
  }

  return { ok: true };
}

/**
 * Brand-new Google identity: only an unused, unexpired, email-bound invitation
 * for that exact Google address. Generic codes never apply.
 */
export function evaluateGoogleSignupInvitation(
  record: InvitationRecord | null,
  googleEmail: string,
  now: Date = new Date(),
): InvitationDecision {
  if (!record || !record.email) {
    return { ok: false, reason: "invalid" };
  }

  if (record.email !== normalizeInvitationEmail(googleEmail)) {
    return { ok: false, reason: "email_mismatch" };
  }

  if (isRevoked(record)) {
    return { ok: false, reason: "invalid" };
  }

  if (isExpired(record, now)) {
    return { ok: false, reason: "expired" };
  }

  if (isExhausted(record)) {
    return { ok: false, reason: "exhausted" };
  }

  return { ok: true };
}

export function evaluateAuthUserInsertInvitation(input: {
  provider: "email" | "google";
  invitationCode: string | null;
  email: string;
  recordByCode: InvitationRecord | null;
  recordByBoundEmail: InvitationRecord | null;
  now?: Date;
}): InvitationDecision {
  if (input.provider === "google") {
    return evaluateGoogleSignupInvitation(input.recordByBoundEmail, input.email, input.now);
  }

  if (!input.invitationCode || input.invitationCode.trim() === "") {
    return { ok: false, reason: "invalid" };
  }

  return evaluateEmailSignupInvitation(input.recordByCode, input.email, input.now);
}

export function parseOwnerEmails(raw: string | undefined): string[] {
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export function isInviteOwner(
  email: string | null | undefined,
  allowlist: readonly string[],
): boolean {
  if (!email || allowlist.length === 0) {
    return false;
  }

  return allowlist.includes(normalizeInvitationEmail(email));
}