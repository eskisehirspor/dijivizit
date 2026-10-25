import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { isValidPublicId } from "@/lib/utils/public-id";

export type ResolvedCard = { profileId: string; cardId: string | null; orgId: string | null };

/**
 * Which published profile a public slug opens: a personal public_id or an
 * active, assigned card. Service-role only; never exposed to clients.
 */
export async function resolvePublicSlug(slug: string): Promise<ResolvedCard | null> {
  if (!isValidPublicId(slug)) return null;
  const { data } = await createAdminClient().rpc("resolve_card", { p_slug: slug });
  const row = data?.[0];
  if (!row?.profile_id) return null;
  return { profileId: row.profile_id, cardId: row.card_id ?? null, orgId: row.org_id ?? null };
}
