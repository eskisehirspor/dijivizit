import "server-only";

import type { CardRow } from "@/lib/db/tables";
import { createClient } from "@/lib/supabase/server";

import { requireUser } from "./auth";

export type CardItem = Pick<
  CardRow,
  "id" | "slug" | "label" | "is_active" | "assigned_to" | "org_id" | "created_at"
> & { views30d: number; contacts: number };

const COLUMNS = "id, slug, label, is_active, assigned_to, org_id, created_at";

/** Profile views and contacts per card over the last 30 days (RLS decides what is visible). */
export async function cardStats(
  cardIds: string[],
): Promise<Map<string, { views30d: number; contacts: number }>> {
  const stats = new Map<string, { views30d: number; contacts: number }>();
  for (const id of cardIds) stats.set(id, { views30d: 0, contacts: 0 });
  if (cardIds.length === 0) return stats;

  const supabase = await createClient();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [{ data: events }, { data: contacts }] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("card_id")
      .in("card_id", cardIds)
      .eq("event_type", "profile_view")
      .gte("created_at", since)
      .limit(20000),
    supabase.from("contacts").select("card_id").in("card_id", cardIds).limit(20000),
  ]);
  for (const e of events ?? []) if (e.card_id) stats.get(e.card_id)!.views30d += 1;
  for (const c of contacts ?? []) if (c.card_id) stats.get(c.card_id)!.contacts += 1;
  return stats;
}

function withStats(
  rows: Omit<CardItem, "views30d" | "contacts">[],
  stats: Map<string, { views30d: number; contacts: number }>,
): CardItem[] {
  return rows.map((r) => ({ ...r, ...(stats.get(r.id) ?? { views30d: 0, contacts: 0 }) }));
}

export async function listOwnCards(): Promise<{
  personal: CardItem[];
  team: (CardItem & { orgName: string })[];
}> {
  const user = await requireUser();
  const supabase = await createClient();
  const [{ data: personal }, { data: team }] = await Promise.all([
    supabase
      .from("cards")
      .select(COLUMNS)
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("cards")
      .select(`${COLUMNS}, organizations(name)`)
      .eq("assigned_to", user.id)
      .not("org_id", "is", null)
      .order("created_at", { ascending: true }),
  ]);
  const ids = [...(personal ?? []), ...(team ?? [])].map((c) => c.id);
  const stats = await cardStats(ids);
  return {
    personal: withStats(personal ?? [], stats),
    team: (team ?? []).map((c) => ({
      ...withStats([c], stats)[0]!,
      orgName: c.organizations?.name ?? "",
    })),
  };
}

export async function listOrgCards(orgId: string): Promise<CardItem[]> {
  await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("cards")
    .select(COLUMNS)
    .eq("org_id", orgId)
    .order("created_at", { ascending: true });
  return withStats(data ?? [], await cardStats((data ?? []).map((c) => c.id)));
}

export async function createCard(input: {
  label: string | null;
  orgId?: string;
  count?: number;
}): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();
  const n = Math.min(Math.max(input.count ?? 1, 1), 50);
  const rows = Array.from({ length: n }, (_, i) =>
    input.orgId
      ? {
          org_id: input.orgId,
          label: input.label ? (n > 1 ? `${input.label} ${i + 1}` : input.label) : null,
        }
      : { owner_id: user.id, assigned_to: user.id, label: input.label },
  );
  const { error } = await supabase.from("cards").insert(rows);
  if (error) console.error("createCard failed:", error.message);
  return !error;
}

export async function updateCard(
  id: string,
  patch: { label?: string | null; is_active?: boolean; assigned_to?: string | null },
): Promise<boolean> {
  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase.from("cards").update(patch).eq("id", id).select("id");
  if (error) console.error("updateCard failed:", error.message);
  return !error && (data?.length ?? 0) === 1;
}

export async function deleteCard(id: string): Promise<boolean> {
  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase.from("cards").delete().eq("id", id).select("id");
  return !error && (data?.length ?? 0) === 1;
}
