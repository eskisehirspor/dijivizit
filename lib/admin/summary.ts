/**
 * Pure aggregation for the owner-only admin overview. Kept free of I/O so the
 * numbers on the page can be unit tested without a database.
 */

export const ACTIVE_WINDOW_DAYS = 30;

export type CompletenessKey = "name" | "title" | "avatar" | "links" | "about";

export const COMPLETENESS_KEYS: readonly CompletenessKey[] = [
  "name",
  "title",
  "avatar",
  "links",
  "about",
];

export type AdminUserInput = {
  id: string;
  email: string | null;
  provider: string;
  createdAt: string;
  lastSignInAt: string | null;
  emailConfirmed: boolean;
  fullName: string | null;
  title: string | null;
  company: string | null;
  about: string | null;
  avatarPath: string | null;
  publicId: string | null;
  isPublished: boolean;
  linkCount: number;
  skillCount: number;
  documentCount: number;
  viewsTotal: number;
  viewsRecent: number;
  interactionsTotal: number;
  lastViewAt: string | null;
  isOwner: boolean;
};

export type CardState = "published" | "draft" | "empty";

export type AdminUserRow = AdminUserInput & {
  completeness: Record<CompletenessKey, boolean>;
  completenessPercent: number;
  cardState: CardState;
  isActive: boolean;
};

function hasText(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function daysAgo(now: Date, days: number): number {
  return now.getTime() - days * 24 * 60 * 60 * 1000;
}

export function completenessOf(user: AdminUserInput): Record<CompletenessKey, boolean> {
  return {
    name: hasText(user.fullName),
    title: hasText(user.title),
    avatar: hasText(user.avatarPath),
    links: user.linkCount > 0,
    about: hasText(user.about) || user.skillCount > 0 || user.documentCount > 0,
  };
}

export function toAdminUserRow(user: AdminUserInput, now: Date = new Date()): AdminUserRow {
  const completeness = completenessOf(user);
  const filled = COMPLETENESS_KEYS.filter((key) => completeness[key]).length;
  const completenessPercent = Math.round((filled / COMPLETENESS_KEYS.length) * 100);

  // "Empty" means the user never got past signup: at most a name (and a Google
  // photo, which arrives without any effort on their part).
  const effort =
    (completeness.title ? 1 : 0) + (completeness.links ? 1 : 0) + (completeness.about ? 1 : 0);
  const cardState: CardState = user.isPublished ? "published" : effort === 0 ? "empty" : "draft";

  const lastSignIn = user.lastSignInAt ? new Date(user.lastSignInAt).getTime() : null;
  const isActive = lastSignIn !== null && lastSignIn >= daysAgo(now, ACTIVE_WINDOW_DAYS);

  return { ...user, completeness, completenessPercent, cardState, isActive };
}

export type AdminOverview = {
  totalUsers: number;
  newUsersRecent: number;
  publishedCards: number;
  activeUsers: number;
  viewsTotal: number;
  viewsRecent: number;
  funnel: {
    registered: number;
    filled: number;
    published: number;
    viewed: number;
  };
};

/**
 * Funnel steps are nested so every bar is a subset of the one above it:
 * started filling (anything beyond the signup name/photo) ⊇ published ⊇ viewed.
 */
export function buildOverview(rows: AdminUserRow[], now: Date = new Date()): AdminOverview {
  const recentCutoff = daysAgo(now, ACTIVE_WINDOW_DAYS);

  return {
    totalUsers: rows.length,
    newUsersRecent: rows.filter((row) => new Date(row.createdAt).getTime() >= recentCutoff).length,
    publishedCards: rows.filter((row) => row.isPublished).length,
    activeUsers: rows.filter((row) => row.isActive).length,
    viewsTotal: rows.reduce((sum, row) => sum + row.viewsTotal, 0),
    viewsRecent: rows.reduce((sum, row) => sum + row.viewsRecent, 0),
    funnel: {
      registered: rows.length,
      filled: rows.filter((row) => row.cardState !== "empty").length,
      published: rows.filter((row) => row.isPublished).length,
      viewed: rows.filter((row) => row.isPublished && row.viewsTotal > 0).length,
    },
  };
}

export type InvitationStatus = "active" | "used" | "expired" | "revoked";

export function invitationStatus(
  invitation: {
    maxUses: number;
    useCount: number;
    expiresAt: string | null;
    revokedAt: string | null;
  },
  now: Date = new Date(),
): InvitationStatus {
  if (invitation.revokedAt) {
    return "revoked";
  }

  if (invitation.useCount >= invitation.maxUses) {
    return "used";
  }

  if (invitation.expiresAt && new Date(invitation.expiresAt).getTime() <= now.getTime()) {
    return "expired";
  }

  return "active";
}

export type AdminUserFilter = "all" | CardState;
export type AdminUserSort = "newest" | "lastSignIn" | "views" | "completeness";

export function filterAndSortUsers<T extends AdminUserRow>(
  rows: T[],
  options: { query: string; filter: AdminUserFilter; sort: AdminUserSort },
): T[] {
  const query = options.query.trim().toLocaleLowerCase("tr-TR");

  const filtered = rows.filter((row) => {
    if (options.filter !== "all" && row.cardState !== options.filter) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [row.fullName, row.email, row.title, row.company]
      .filter(Boolean)
      .some((value) => value!.toLocaleLowerCase("tr-TR").includes(query));
  });

  const time = (value: string | null) => (value ? new Date(value).getTime() : 0);

  return [...filtered].sort((a, b) => {
    switch (options.sort) {
      case "lastSignIn":
        return time(b.lastSignInAt) - time(a.lastSignInAt);
      case "views":
        return b.viewsTotal - a.viewsTotal || time(b.createdAt) - time(a.createdAt);
      case "completeness":
        return (
          b.completenessPercent - a.completenessPercent || time(b.createdAt) - time(a.createdAt)
        );
      case "newest":
      default:
        return time(b.createdAt) - time(a.createdAt);
    }
  });
}

export function initialsFromName(name: string | null, fallback: string | null): string {
  const source = (name ?? "").trim() || (fallback ?? "").trim();
  const parts = source.split(/[\s@._-]+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1 || !name?.trim()) {
    return parts[0]!.slice(0, 2).toLocaleUpperCase("tr-TR");
  }

  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toLocaleUpperCase("tr-TR");
}
