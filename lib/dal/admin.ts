import "server-only";

import { cache } from "react";

import {
  ACTIVE_WINDOW_DAYS,
  invitationStatus,
  toAdminUserRow,
  type AdminUserInput,
  type AdminUserRow,
  type InvitationStatus,
} from "@/lib/admin/summary";
import { requireInviteOwner, viewerIsInviteOwner } from "@/lib/dal/invitations";
import { AVATAR_BUCKET } from "@/lib/profile/avatar";
import { createAdminClient } from "@/lib/supabase/admin";

/*
 * Owner-only reads for the admin overview. Every export re-checks the owner
 * allowlist: the service-role client bypasses RLS, so this module is the only
 * thing standing between it and other users' data.
 *
 * Sensitive records (IBAN, tax details) are reduced to presence flags here and
 * never leave the server in full.
 */

const PAGE_SIZE = 1000;

type Page<T> = { data: T[] | null; error: unknown };

/** PostgREST caps responses at 1000 rows; page through so counts stay correct. */
async function fetchAll<T>(
  fetchPage: (from: number, to: number) => PromiseLike<Page<T>>,
): Promise<T[]> {
  const rows: T[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await fetchPage(from, from + PAGE_SIZE - 1);

    if (error || !data) {
      break;
    }

    rows.push(...data);

    if (data.length < PAGE_SIZE) {
      break;
    }
  }

  return rows;
}

type AuthUserSummary = {
  id: string;
  email: string | null;
  provider: string;
  createdAt: string;
  lastSignInAt: string | null;
  emailConfirmed: boolean;
};

async function listAuthUsers(): Promise<AuthUserSummary[]> {
  const supabase = createAdminClient();
  const users: AuthUserSummary[] = [];

  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: PAGE_SIZE });

    if (error || !data) {
      break;
    }

    for (const user of data.users) {
      users.push({
        id: user.id,
        email: user.email ?? null,
        provider:
          typeof user.app_metadata?.provider === "string" ? user.app_metadata.provider : "email",
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at ?? null,
        emailConfirmed: Boolean(user.email_confirmed_at),
      });
    }

    if (data.users.length < PAGE_SIZE) {
      break;
    }
  }

  return users;
}

function countBy<T>(rows: T[], key: (row: T) => string): Map<string, number> {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const k = key(row);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }

  return counts;
}

function avatarUrlFor(path: string | null): string | null {
  if (!path) {
    return null;
  }

  const supabase = createAdminClient();
  return supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl;
}

export type AdminUserListItem = AdminUserRow & { avatarUrl: string | null };

export type AdminInvitation = {
  id: string;
  email: string | null;
  maxUses: number;
  useCount: number;
  expiresAt: string | null;
  createdAt: string;
  revokedAt: string | null;
  status: InvitationStatus;
  redeemedBy: { userId: string; name: string | null; email: string | null; redeemedAt: string }[];
};

export type AdminData = {
  users: AdminUserListItem[];
  invitations: AdminInvitation[];
};

/** Everything the overview needs, loaded once per request. */
export const getAdminData = cache(async (): Promise<AdminData> => {
  await requireInviteOwner();

  const supabase = createAdminClient();
  const now = new Date();
  const recentCutoff = now.getTime() - ACTIVE_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  const [authUsers, profiles, links, skills, documents, events, invitations, redemptions] =
    await Promise.all([
      listAuthUsers(),
      fetchAll((from, to) =>
        supabase
          .from("profiles")
          .select("id, public_id, full_name, title, company, about, avatar_path, is_published")
          .range(from, to),
      ),
      fetchAll((from, to) => supabase.from("profile_links").select("profile_id").range(from, to)),
      fetchAll((from, to) => supabase.from("profile_skills").select("profile_id").range(from, to)),
      fetchAll((from, to) => supabase.from("documents").select("user_id").range(from, to)),
      fetchAll((from, to) =>
        supabase
          .from("analytics_events")
          .select("profile_id, event_type, created_at")
          // Events older than 13 months are pruned by record_card_event, so
          // this matches what is kept and bounds the scan as data grows.
          .gte("created_at", new Date(now.getTime() - 396 * 24 * 60 * 60 * 1000).toISOString())
          .range(from, to),
      ),
      fetchAll((from, to) =>
        supabase
          .from("invitation_codes")
          .select("id, email, max_uses, use_count, expires_at, created_at, revoked_at")
          .order("created_at", { ascending: false })
          .range(from, to),
      ),
      fetchAll((from, to) =>
        supabase
          .from("invitation_redemptions")
          .select("code_id, user_id, redeemed_at")
          .range(from, to),
      ),
    ]);

  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const linkCounts = countBy(links, (row) => row.profile_id);
  const skillCounts = countBy(skills, (row) => row.profile_id);
  const documentCounts = countBy(documents, (row) => row.user_id);

  const views = events.filter((event) => event.event_type === "profile_view");
  const viewCounts = countBy(views, (row) => row.profile_id);
  const recentViewCounts = countBy(
    views.filter((event) => new Date(event.created_at).getTime() >= recentCutoff),
    (row) => row.profile_id,
  );
  const interactionCounts = countBy(events, (row) => row.profile_id);
  const lastViewAt = new Map<string, string>();

  for (const view of views) {
    const previous = lastViewAt.get(view.profile_id);
    if (!previous || previous < view.created_at) {
      lastViewAt.set(view.profile_id, view.created_at);
    }
  }

  const users: AdminUserListItem[] = authUsers.map((user) => {
    const profile = profileById.get(user.id);

    const input: AdminUserInput = {
      ...user,
      fullName: profile?.full_name ?? null,
      title: profile?.title ?? null,
      company: profile?.company ?? null,
      about: profile?.about ?? null,
      avatarPath: profile?.avatar_path ?? null,
      publicId: profile?.public_id ?? null,
      isPublished: profile?.is_published ?? false,
      linkCount: linkCounts.get(user.id) ?? 0,
      skillCount: skillCounts.get(user.id) ?? 0,
      documentCount: documentCounts.get(user.id) ?? 0,
      viewsTotal: viewCounts.get(user.id) ?? 0,
      viewsRecent: recentViewCounts.get(user.id) ?? 0,
      interactionsTotal: interactionCounts.get(user.id) ?? 0,
      lastViewAt: lastViewAt.get(user.id) ?? null,
      isOwner: viewerIsInviteOwner(user.email),
    };

    return { ...toAdminUserRow(input, now), avatarUrl: avatarUrlFor(input.avatarPath) };
  });

  const userById = new Map(users.map((user) => [user.id, user]));

  const adminInvitations: AdminInvitation[] = invitations.map((invitation) => {
    const record = {
      maxUses: invitation.max_uses,
      useCount: invitation.use_count,
      expiresAt: invitation.expires_at,
      revokedAt: invitation.revoked_at,
    };

    return {
      id: invitation.id,
      email: invitation.email,
      createdAt: invitation.created_at,
      ...record,
      status: invitationStatus(record, now),
      redeemedBy: redemptions
        .filter((redemption) => redemption.code_id === invitation.id)
        .map((redemption) => {
          const user = userById.get(redemption.user_id);
          return {
            userId: redemption.user_id,
            name: user?.fullName ?? null,
            email: user?.email ?? null,
            redeemedAt: redemption.redeemed_at,
          };
        }),
    };
  });

  return { users, invitations: adminInvitations };
});

export type AdminUserDetail = AdminUserListItem & {
  links: {
    id: string;
    platform: string;
    label: string | null;
    value: string;
    isVisible: boolean;
  }[];
  skills: { id: string; name: string; type: string }[];
  documents: { id: string; title: string; fileName: string; isVisible: boolean }[];
  hasBankAccount: boolean;
  hasBillingInfo: boolean;
  address: string | null;
  eventCounts: Record<string, number>;
  invitation: { email: string | null; redeemedAt: string } | null;
};

export async function getAdminUserDetail(userId: string): Promise<AdminUserDetail | null> {
  await requireInviteOwner();

  const { users, invitations } = await getAdminData();
  const user = users.find((candidate) => candidate.id === userId);

  if (!user) {
    return null;
  }

  const supabase = createAdminClient();

  const [links, skills, documents, bank, billing, profile, events] = await Promise.all([
    supabase
      .from("profile_links")
      .select("id, platform, label, value, is_visible, display_order")
      .eq("profile_id", userId)
      .order("display_order"),
    supabase
      .from("profile_skills")
      .select("id, name, type, display_order")
      .eq("profile_id", userId)
      .order("display_order"),
    supabase
      .from("documents")
      .select("id, title, file_name, is_visible, display_order")
      .eq("user_id", userId)
      .order("display_order"),
    supabase.from("bank_accounts").select("id").eq("user_id", userId).maybeSingle(),
    supabase.from("billing_infos").select("id").eq("user_id", userId).maybeSingle(),
    supabase.from("profiles").select("address").eq("id", userId).maybeSingle(),
    fetchAll((from, to) =>
      supabase
        .from("analytics_events")
        .select("event_type")
        .eq("profile_id", userId)
        .range(from, to),
    ),
  ]);

  const invitation = invitations
    .flatMap((candidate) =>
      candidate.redeemedBy
        .filter((redemption) => redemption.userId === userId)
        .map((redemption) => ({ email: candidate.email, redeemedAt: redemption.redeemedAt })),
    )
    .at(0);

  return {
    ...user,
    links: (links.data ?? []).map((link) => ({
      id: link.id,
      platform: link.platform,
      label: link.label,
      value: link.value,
      isVisible: link.is_visible,
    })),
    skills: (skills.data ?? []).map((skill) => ({
      id: skill.id,
      name: skill.name,
      type: skill.type,
    })),
    documents: (documents.data ?? []).map((document) => ({
      id: document.id,
      title: document.title,
      fileName: document.file_name,
      isVisible: document.is_visible,
    })),
    hasBankAccount: Boolean(bank.data),
    hasBillingInfo: Boolean(billing.data),
    address: profile.data?.address ?? null,
    eventCounts: Object.fromEntries(countBy(events, (row) => row.event_type)),
    invitation: invitation ?? null,
  };
}
