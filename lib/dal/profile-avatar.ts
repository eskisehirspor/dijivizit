import "server-only";

import { AVATAR_BUCKET, extensionForAvatarMime, type AvatarMimeType } from "@/lib/profile/avatar";
import { createClient } from "@/lib/supabase/server";

import { requireUser } from "./auth";
import { getOwnProfile } from "./profile";

export type AvatarMutationResult =
  { ok: true; path: string | null } | { ok: false; code: "upload" | "db" | "unknown" };

/**
 * Uploads a new avatar object, points profiles.avatar_path at it, then best-effort
 * deletes the previous object. avatar_path is the source of truth.
 */
export async function uploadOwnAvatar(
  file: File,
  mime: AvatarMimeType,
): Promise<AvatarMutationResult> {
  const user = await requireUser();
  const supabase = await createClient();
  const profile = await getOwnProfile();
  const previousPath = profile?.avatar_path ?? null;

  const extension = extensionForAvatarMime(mime);
  const nextPath = `${user.id}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(nextPath, file, {
    contentType: mime,
    upsert: false,
    cacheControl: "3600",
  });

  if (uploadError) {
    return { ok: false, code: "upload" };
  }

  const { error: dbError } = await supabase
    .from("profiles")
    .update({ avatar_path: nextPath })
    .eq("id", user.id);

  if (dbError) {
    // Scenario B: upload succeeded, DB failed — remove the orphaned new object.
    await supabase.storage.from(AVATAR_BUCKET).remove([nextPath]);
    return { ok: false, code: "db" };
  }

  if (previousPath && previousPath !== nextPath) {
    // Scenario C: ignore deletion failure; DB already points at the new path.
    await supabase.storage.from(AVATAR_BUCKET).remove([previousPath]);
  }

  return { ok: true, path: nextPath };
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
