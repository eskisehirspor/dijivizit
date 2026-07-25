import "server-only";

import { cache } from "react";

import type { ProfileLinkRow } from "@/lib/db/tables";
import { PROFILE_LINK_LIMIT } from "@/lib/profile/platforms";
import { createClient } from "@/lib/supabase/server";
import type { CreateProfileLinkInput } from "@/lib/validations/profile-links";

import { requireUser } from "./auth";

export type OwnProfileLink = Pick<
  ProfileLinkRow,
  "id" | "platform" | "label" | "value" | "display_order" | "is_visible" | "created_at"
>;

const LINK_COLUMNS = "id, platform, label, value, display_order, is_visible, created_at";

export const getOwnProfileLinks = cache(async (): Promise<OwnProfileLink[]> => {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profile_links")
    .select(LINK_COLUMNS)
    .eq("profile_id", user.id)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load profile links: ${error.message}`);
  }

  return data ?? [];
});

export async function createOwnProfileLink(
  input: CreateProfileLinkInput,
): Promise<{ ok: true } | { ok: false; code: "limit" | "unknown" }> {
  const user = await requireUser();
  const supabase = await createClient();

  const existing = await getOwnProfileLinks();
  if (existing.length >= PROFILE_LINK_LIMIT) {
    return { ok: false, code: "limit" };
  }

  const nextOrder =
    existing.length === 0 ? 0 : Math.max(...existing.map((link) => link.display_order)) + 1;

  const { error } = await supabase.from("profile_links").insert({
    profile_id: user.id,
    platform: input.platform,
    label: input.label,
    value: input.value,
    display_order: nextOrder,
    is_visible: true,
  });

  if (error) {
    if (error.message.includes("maximum of")) {
      return { ok: false, code: "limit" };
    }
    return { ok: false, code: "unknown" };
  }

  return { ok: true };
}

export async function updateOwnProfileLink(input: {
  id: string;
  value: string;
  label: string | null;
}): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profile_links")
    .update({ value: input.value, label: input.label })
    .eq("id", input.id)
    .eq("profile_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return true;
}

export async function setOwnProfileLinkVisibility(
  id: string,
  isVisible: boolean,
): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profile_links")
    .update({ is_visible: isVisible })
    .eq("id", id)
    .eq("profile_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return true;
}

export async function deleteOwnProfileLink(id: string): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profile_links")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return true;
}

export async function moveOwnProfileLink(id: string, direction: "up" | "down"): Promise<boolean> {
  const user = await requireUser();
  const links = await getOwnProfileLinks();
  const index = links.findIndex((link) => link.id === id);

  if (index === -1) {
    return false;
  }

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= links.length) {
    return true;
  }

  const current = links[index];
  const neighbor = links[swapIndex];
  if (!current || !neighbor) {
    return false;
  }

  const supabase = await createClient();

  // Two updates; display_order is not unique so no temporary shuffle is needed.
  const { error: firstError } = await supabase
    .from("profile_links")
    .update({ display_order: neighbor.display_order })
    .eq("id", current.id)
    .eq("profile_id", user.id);

  if (firstError) {
    return false;
  }

  const { error: secondError } = await supabase
    .from("profile_links")
    .update({ display_order: current.display_order })
    .eq("id", neighbor.id)
    .eq("profile_id", user.id);

  if (secondError) {
    return false;
  }

  return true;
}
