import "server-only";

import { cache } from "react";

import type { ProfileRow } from "@/lib/db/tables";
import { createClient } from "@/lib/supabase/server";
import type { BasicProfileInput } from "@/lib/validations/profile";

import { requireUser } from "./auth";

/** The owner's own card, as shown in the dashboard and editor. */
export type OwnProfile = Pick<
  ProfileRow,
  | "public_id"
  | "full_name"
  | "title"
  | "company"
  | "about"
  | "address"
  | "avatar_path"
  | "theme"
  | "locale"
  | "is_published"
>;

const OWN_PROFILE_COLUMNS =
  "public_id, full_name, title, company, about, address, avatar_path, theme, locale, is_published";

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

/**
 * Updates only the basic identity fields. Avatar, links, skills, theme, locale,
 * and publish state have their own slices and must not be written here.
 */
export async function updateOwnBasicProfile(input: BasicProfileInput): Promise<void> {
  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: input.fullName,
      title: input.title,
      company: input.company,
      about: input.about,
      address: input.address,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}

/**
 * Toggles whether the owner's card is reachable at /p/{public_id}.
 * The public_id (and thus the URL) stays stable either way.
 */
export async function setOwnProfilePublished(published: boolean): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update({ is_published: published })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return true;
}
