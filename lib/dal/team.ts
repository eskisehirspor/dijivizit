import "server-only";

import { createClient } from "@/lib/supabase/server";

import { requireUser } from "./auth";
import { type CardItem, listOrgCards } from "./cards";

export type TeamRole = "owner" | "admin" | "member";
export type TeamSummary = { id: string; name: string; role: TeamRole };

export type TeamMember = {
  userId: string;
  role: TeamRole;
  fullName: string | null;
  title: string | null;
  email: string;
  publicId: string;
  isPublished: boolean;
  cards: number;
  views30d: number;
  contacts: number;
};

export type TeamInvite = { id: string; email: string; role: string; createdAt: string };

export type TeamDetail = {
  team: TeamSummary;
  members: TeamMember[];
  invites: TeamInvite[];
  cards: CardItem[];
  contacts: {
    id: string;
    full_name: string;
    company: string | null;
    phone: string | null;
    email: string | null;
    created_at: string;
    collectedBy: string;
  }[];
};

export async function listMyTeams(): Promise<TeamSummary[]> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("organization_members")
    .select("role, organizations(id, name)")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true });
  return (data ?? [])
    .filter((row) => row.organizations)
    .map((row) => ({
      id: row.organizations!.id,
      name: row.organizations!.name,
      role: row.role as TeamRole,
    }));
}

export async function listMyTeamInvites() {
  await requireUser();
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_my_org_invites");
  return (data ?? []).map((i) => ({ id: i.id, orgName: i.org_name, role: i.role }));
}

export async function getTeamDetail(team: TeamSummary): Promise<TeamDetail> {
  const supabase = await createClient();
  const isAdmin = team.role !== "member";

  const [{ data: members }, invitesRes, cards, contactsRes] = await Promise.all([
    supabase.rpc("get_org_members", { p_org: team.id }),
    isAdmin
      ? supabase
          .from("organization_invites")
          .select("id, email, role, created_at")
          .eq("org_id", team.id)
          .is("accepted_at", null)
          .is("revoked_at", null)
          .gt("expires_at", new Date().toISOString())
          .order("created_at", { ascending: false })
      : Promise.resolve({
          data: [] as { id: string; email: string; role: string; created_at: string }[],
        }),
    isAdmin ? listOrgCards(team.id) : Promise.resolve([] as CardItem[]),
    isAdmin
      ? supabase
          .from("contacts")
          .select("id, full_name, company, phone, email, created_at, profile_id")
          .eq("org_id", team.id)
          .order("created_at", { ascending: false })
          .limit(200)
      : Promise.resolve({
          data: [] as {
            id: string;
            full_name: string;
            company: string | null;
            phone: string | null;
            email: string | null;
            created_at: string;
            profile_id: string;
          }[],
        }),
  ]);

  const byMember = new Map<string, { cards: number; views30d: number; contacts: number }>();
  for (const card of cards) {
    if (!card.assigned_to) continue;
    const agg = byMember.get(card.assigned_to) ?? { cards: 0, views30d: 0, contacts: 0 };
    agg.cards += 1;
    agg.views30d += card.views30d;
    agg.contacts += card.contacts;
    byMember.set(card.assigned_to, agg);
  }

  const memberList: TeamMember[] = (members ?? []).map((m) => ({
    userId: m.user_id,
    role: m.role as TeamRole,
    fullName: m.full_name,
    title: m.title,
    email: m.email,
    publicId: m.public_id,
    isPublished: m.is_published,
    ...(byMember.get(m.user_id) ?? { cards: 0, views30d: 0, contacts: 0 }),
  }));
  const nameOf = new Map(memberList.map((m) => [m.userId, m.fullName || m.email]));

  return {
    team,
    members: memberList,
    invites: (invitesRes.data ?? []).map((i) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      createdAt: i.created_at,
    })),
    cards,
    contacts: (contactsRes.data ?? []).map((c) => ({
      id: c.id,
      full_name: c.full_name,
      company: c.company,
      phone: c.phone,
      email: c.email,
      created_at: c.created_at,
      collectedBy: nameOf.get(c.profile_id) ?? "—",
    })),
  };
}

export async function createTeam(name: string): Promise<string | null> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .insert({ name, created_by: user.id })
    .select("id")
    .single();
  if (error) console.error("createTeam failed:", error.message);
  return data?.id ?? null;
}

export async function renameTeam(orgId: string, name: string): Promise<boolean> {
  await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("organizations")
    .update({ name })
    .eq("id", orgId)
    .select("id");
  return (data?.length ?? 0) === 1;
}

export async function createTeamInvite(
  orgId: string,
  email: string,
  role: "admin" | "member",
): Promise<"ok" | "exists" | "failed"> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("organization_invites")
    .insert({ org_id: orgId, email, role, invited_by: user.id });
  if (error) return error.code === "23505" ? "exists" : "failed";
  return "ok";
}

export async function revokeTeamInvite(inviteId: string): Promise<boolean> {
  await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("organization_invites")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", inviteId)
    .select("id");
  return (data?.length ?? 0) === 1;
}

export async function acceptTeamInvite(inviteId: string): Promise<string | null> {
  await requireUser();
  const supabase = await createClient();
  const { data } = await supabase.rpc("accept_org_invite", { p_invite_id: inviteId });
  return data ?? null;
}

export async function setMemberRole(
  orgId: string,
  userId: string,
  role: TeamRole,
): Promise<boolean> {
  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organization_members")
    .update({ role })
    .eq("org_id", orgId)
    .eq("user_id", userId)
    .select("user_id");
  return !error && (data?.length ?? 0) === 1;
}

export async function removeMember(orgId: string, userId: string): Promise<boolean> {
  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organization_members")
    .delete()
    .eq("org_id", orgId)
    .eq("user_id", userId)
    .select("user_id");
  return !error && (data?.length ?? 0) === 1;
}

export async function deleteTeam(orgId: string): Promise<boolean> {
  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .delete()
    .eq("id", orgId)
    .select("id");
  return !error && (data?.length ?? 0) === 1;
}
