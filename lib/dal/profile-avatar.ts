import "server-only";

import {
  AVATAR_BUCKET,
  AVATAR_MAX_BYTES,
  extensionForAvatarMime,
  isAvatarMimeType,
  type AvatarMimeType,
} from "@/lib/profile/avatar";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import { requireUser } from "./auth";
import { getOwnProfile } from "./profile";

export type AvatarMutationResult =
  { ok: true; path: string | null } | { ok: false; code: "upload" | "db" | "unknown" };

/** Reserves an owner-folder path for a browser-side avatar upload. */
export async function reserveOwnAvatarUpload(mime: AvatarMimeType): Promise<string> {
  const user = await requireUser();
  return `${user.id}/${crypto.randomUUID()}.${extensionForAvatarMime(mime)}`;
}

const AVATAR_PATH_PATTERN =
  /^([0-9a-f-]{36})\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/;

/**
 * Points profiles.avatar_path at an object the browser already uploaded, then
 * best-effort deletes the previous object. Size and type are read back from
 * Storage rather than trusted from the client; avatar_path is the source of truth.
 */
export async function finalizeOwnAvatar(path: string): Promise<AvatarMutationResult> {
  const user = await requireUser();
  const admin = createAdminClient();

  const match = AVATAR_PATH_PATTERN.exec(path);
  if (!match || match[1] !== user.id) {
    return { ok: false, code: "upload" };
  }

  const { data: object, error: infoError } = await admin.storage.from(AVATAR_BUCKET).info(path);
  const size = object?.size ?? 0;

  if (
    infoError ||
    !object ||
    size <= 0 ||
    size > AVATAR_MAX_BYTES ||
    !isAvatarMimeType(object.contentType ?? "")
  ) {
    await admin.storage.from(AVATAR_BUCKET).remove([path]);
    return { ok: false, code: "upload" };
  }

  const supabase = await createClient();
  const profile = await getOwnProfile();
  const previousPath = profile?.avatar_path ?? null;

  const { error: dbError } = await supabase
    .from("profiles")
    .update({ avatar_path: path })
    .eq("id", user.id);

  if (dbError) {
    await admin.storage.from(AVATAR_BUCKET).remove([path]);
    return { ok: false, code: "db" };
  }

  if (previousPath && previousPath !== path) {
    await supabase.storage.from(AVATAR_BUCKET).remove([previousPath]);
  }

  return { ok: true, path };
}

/**
 * Clears profiles.avatar_path, then best-effort deletes the storage object.
 */
export async function removeOwnAvatar(): Promise<AvatarMutationResult> {
  const user = await requireUser();
  const supabase = await createClient();
  const profile = await getOwnProfile();
  const previousPath = profile?.avatar_path ?? null;

  if (!previousPath) {
    return { ok: true, path: null };
  }

  const { error: dbError } = await supabase
    .from("profiles")
    .update({ avatar_path: null })
    .eq("id", user.id);

  if (dbError) {
    // Scenario D: do not delete storage if the DB clear failed.
    return { ok: false, code: "db" };
  }

  // Scenario E: ignore storage delete failure; avatar_path is already null.
  await supabase.storage.from(AVATAR_BUCKET).remove([previousPath]);

  return { ok: true, path: null };
}
