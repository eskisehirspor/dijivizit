import "server-only";

import {
  AVATAR_BUCKET,
  AVATAR_MAX_BYTES,
  extensionForAvatarMime,
  isAvatarMimeType,
  type AvatarMimeType,
} from "@/lib/profile/avatar";
import { isCardThemeId } from "@/lib/profile/themes";
import { isValidVanitySlug } from "@/lib/profile/vanity";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import { requireUser } from "./auth";

export type OwnAppearance = {
  theme: string;
  coverPath: string | null;
  vanitySlug: string | null;
};

export async function getOwnAppearance(): Promise<OwnAppearance | null> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("theme, cover_path, vanity_slug")
    .eq("id", user.id)
    .maybeSingle();
  if (!data) return null;
  return { theme: data.theme, coverPath: data.cover_path, vanitySlug: data.vanity_slug };
}

export async function setOwnTheme(theme: string): Promise<boolean> {
  if (!isCardThemeId(theme)) return false;
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ theme }).eq("id", user.id);
  return !error;
}

export type VanityResult = { ok: true } | { ok: false; code: "invalid" | "taken" | "db" };

/** Sets or clears (empty string) the owner's personal link. */
export async function setOwnVanitySlug(slug: string): Promise<VanityResult> {
  const value = slug === "" ? null : slug;
  if (value !== null && !isValidVanitySlug(value)) return { ok: false, code: "invalid" };

  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ vanity_slug: value })
    .eq("id", user.id);

  if (error) {
    return { ok: false, code: error.code === "23505" ? "taken" : "db" };
  }
  return { ok: true };
}

// Images (cover photo, product photos) ----------------------------------------
// Same bucket, limits and owner-folder rule as the profile photo.

const IMAGE_PATH_PATTERN =
  /^([0-9a-f-]{36})\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/;

export async function reserveOwnImageUpload(mime: AvatarMimeType): Promise<string> {
  const user = await requireUser();
  return `${user.id}/${crypto.randomUUID()}.${extensionForAvatarMime(mime)}`;
}

/** Checks an object the browser uploaded really is the caller's, and an image. */
export async function verifyOwnUploadedImage(path: string): Promise<boolean> {
  const user = await requireUser();
  const admin = createAdminClient();

  const match = IMAGE_PATH_PATTERN.exec(path);
  if (!match || match[1] !== user.id) return false;

  const { data: object, error } = await admin.storage.from(AVATAR_BUCKET).info(path);
  const size = object?.size ?? 0;
  if (
    error ||
    !object ||
    size <= 0 ||
    size > AVATAR_MAX_BYTES ||
    !isAvatarMimeType(object.contentType ?? "")
  ) {
    await admin.storage.from(AVATAR_BUCKET).remove([path]);
    return false;
  }
  return true;
}

export async function removeOwnImage(path: string | null): Promise<void> {
  if (!path) return;
  const supabase = await createClient();
  await supabase.storage.from(AVATAR_BUCKET).remove([path]);
}

export async function setOwnCover(path: string | null): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();
  const current = await getOwnAppearance();

  if (path !== null && !(await verifyOwnUploadedImage(path))) return false;

  const { error } = await supabase.from("profiles").update({ cover_path: path }).eq("id", user.id);

  if (error) {
    if (path) await removeOwnImage(path);
    return false;
  }

  if (current?.coverPath && current.coverPath !== path) {
    await removeOwnImage(current.coverPath);
  }
  return true;
}
