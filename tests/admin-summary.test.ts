import { describe, expect, it } from "vitest";

import { formatRelative, percentOf } from "@/lib/admin/format";
import {
  buildOverview,
  filterAndSortUsers,
  initialsFromName,
  invitationStatus,
  toAdminUserRow,
  type AdminUserInput,
} from "@/lib/admin/summary";

const now = new Date("2026-10-23T12:00:00.000Z");

function user(overrides: Partial<AdminUserInput> = {}): AdminUserInput {
  return {
    id: crypto.randomUUID(),
    email: "a@example.com",
    provider: "email",
    createdAt: "2026-08-01T00:00:00.000Z",
    lastSignInAt: null,
    emailConfirmed: true,
    fullName: "Ayşe Demir",
    title: null,
    company: null,
    about: null,
    avatarPath: null,
    publicId: "abcdefghijk",
    isPublished: false,
    linkCount: 0,
    skillCount: 0,
    documentCount: 0,
    viewsTotal: 0,
    viewsRecent: 0,
    interactionsTotal: 0,
    lastViewAt: null,
    isOwner: false,
    ...overrides,
  };
}

describe("toAdminUserRow", () => {
  it("treats a signup with only a name and Google photo as empty", () => {
    const row = toAdminUserRow(user({ avatarPath: "x/avatar.jpg" }), now);
    expect(row.cardState).toBe("empty");
    expect(row.completenessPercent).toBe(40);
  });

  it("counts skills or documents as filling the about check", () => {
    const row = toAdminUserRow(user({ skillCount: 2 }), now);
    expect(row.completeness.about).toBe(true);
    expect(row.cardState).toBe("draft");
  });

  it("marks published cards regardless of completeness", () => {
    expect(toAdminUserRow(user({ isPublished: true }), now).cardState).toBe("published");
  });

  it("is active only with a sign-in inside the window", () => {
    expect(toAdminUserRow(user({ lastSignInAt: "2026-10-10T00:00:00.000Z" }), now).isActive).toBe(
      true,
    );
    expect(toAdminUserRow(user({ lastSignInAt: "2026-08-18T00:00:00.000Z" }), now).isActive).toBe(
      false,
    );
    expect(toAdminUserRow(user(), now).isActive).toBe(false);
  });
});

describe("buildOverview", () => {
  it("builds a monotonic funnel and totals", () => {
    const rows = [
      user({
        title: "a",
        avatarPath: "p",
        linkCount: 2,
        about: "x",
        isPublished: true,
        viewsTotal: 5,
        viewsRecent: 2,
      }),
      user({ title: "a", avatarPath: "p", linkCount: 1, isPublished: true }),
      user({ createdAt: "2026-10-20T00:00:00.000Z" }),
    ].map((input) => toAdminUserRow(input, now));

    const overview = buildOverview(rows, now);

    expect(overview.totalUsers).toBe(3);
    expect(overview.newUsersRecent).toBe(1);
    expect(overview.publishedCards).toBe(2);
    expect(overview.viewsTotal).toBe(5);
    expect(overview.viewsRecent).toBe(2);
    expect(overview.funnel).toEqual({ registered: 3, filled: 2, published: 2, viewed: 1 });
  });
});

describe("invitationStatus", () => {
  const base = { maxUses: 1, useCount: 0, expiresAt: null, revokedAt: null };

  it("prefers revoked over every other state", () => {
    expect(invitationStatus({ ...base, useCount: 1, revokedAt: "2026-09-01" }, now)).toBe(
      "revoked",
    );
  });

  it("reports used, expired and active", () => {
    expect(invitationStatus({ ...base, useCount: 1 }, now)).toBe("used");
    expect(invitationStatus({ ...base, expiresAt: "2026-10-01T00:00:00.000Z" }, now)).toBe(
      "expired",
    );
    expect(invitationStatus(base, now)).toBe("active");
  });
});

describe("filterAndSortUsers", () => {
  const rows = [
    user({
      fullName: "Çağatay Özada",
      company: "İTÜ",
      isPublished: true,
      viewsTotal: 4,
      createdAt: "2026-08-18T00:00:00.000Z",
    }),
    user({
      fullName: "Mehmet Boncuk",
      email: "m@sabah.com.tr",
      viewsTotal: 9,
      createdAt: "2026-08-13T00:00:00.000Z",
    }),
    user({ fullName: "Elif Sert", title: "Koordinatör", createdAt: "2026-08-20T00:00:00.000Z" }),
  ].map((input) => toAdminUserRow(input, now));

  it("searches name, email and company with Turkish casing", () => {
    expect(filterAndSortUsers(rows, { query: "itü", filter: "all", sort: "newest" })).toHaveLength(
      1,
    );
    expect(
      filterAndSortUsers(rows, { query: "SABAH", filter: "all", sort: "newest" })[0]!.fullName,
    ).toBe("Mehmet Boncuk");
  });

  it("filters by card state and sorts", () => {
    expect(
      filterAndSortUsers(rows, { query: "", filter: "published", sort: "newest" }),
    ).toHaveLength(1);
    expect(filterAndSortUsers(rows, { query: "", filter: "all", sort: "views" })[0]!.fullName).toBe(
      "Mehmet Boncuk",
    );
    expect(
      filterAndSortUsers(rows, { query: "", filter: "all", sort: "newest" })[0]!.fullName,
    ).toBe("Elif Sert");
  });
});

describe("formatting helpers", () => {
  it("builds initials from name or email", () => {
    expect(initialsFromName("çağatay özada", null)).toBe("ÇÖ");
    expect(initialsFromName(null, "mazhar@gmail.com")).toBe("MA");
    expect(initialsFromName(null, null)).toBe("?");
  });

  it("formats relative times in Turkish", () => {
    expect(formatRelative("2026-10-20T12:00:00.000Z", now)).toBe("3 gün önce");
    expect(formatRelative(null, now)).toBe("—");
  });

  it("guards percent against division by zero", () => {
    expect(percentOf(1, 0)).toBe(0);
    expect(percentOf(1, 3)).toBe(33);
  });
});
