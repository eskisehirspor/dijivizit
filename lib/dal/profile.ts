import "server-only";

import { cache } from "react";

import type { ProfileRow } from "@/lib/db/tables";
import { createClient } from "@/lib/supabase/server";

import { requireUser } from "./auth";

/** The owner's own card, as shown in the dashboard and editor. */
export type OwnProfile = Pick<
  ProfileRow,
  | "public_id"
  | "full_name"
  | "title"
  | "company"
  | "about"
  | "avatar_path"
  | "theme"
  | "locale"
  | "is_published"
>;

const OWN_PROFILE_COLUMNS =
  "public_id, full_name, title, company, about, avatar_path, theme, locale, is_published";

export const getOwnProfile = cache(async (): Promise<OwnProfile | null> => {
  const user = await requireUser();
  const supabase = await createClient();

  // Row-level security also scopes this to the caller; the explicit eq keeps the
  // intent visible at the call site instead of relying on the policy alone.
  const { data, error } = await supabase
    .from("profiles")
    .select(OWN_PROFILE_COLUMNS)
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load profile: ${error.message}`);
  }

  return data;
});
