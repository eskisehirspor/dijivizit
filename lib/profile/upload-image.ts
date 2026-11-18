"use client";

import { reserveImageUploadAction } from "@/app/actions/profile-appearance";
import { AVATAR_BUCKET } from "@/lib/profile/avatar";
import { createClient } from "@/lib/supabase/client";
import { validateAvatarFile } from "@/lib/validations/profile-avatar";

export type UploadImageResult = { ok: true; path: string } | { ok: false; code: string };

/**
 * Uploads a cover or product photo straight from the browser into the owner's
 * folder of the avatars bucket. The caller then hands the path to a server
 * action, which re-checks the stored object before using it.
 */
export async function uploadOwnImage(file: File): Promise<UploadImageResult> {
  const local = validateAvatarFile(file);
  if (!local.ok) {
    return {
      ok: false,
      code:
        local.code === "size"
          ? "profile.avatar.errors.tooLarge"
          : local.code === "empty"
            ? "profile.avatar.errors.empty"
            : "profile.avatar.errors.typeInvalid",
    };
  }

  const reserved = await reserveImageUploadAction({ type: file.type, size: file.size });
  if (!reserved.ok) return { ok: false, code: reserved.code };

  const { error } = await createClient()
    .storage.from(AVATAR_BUCKET)
    .upload(reserved.data.path, file, {
      contentType: file.type,
      upsert: false,
      cacheControl: "3600",
    });
  if (error) return { ok: false, code: "profile.avatar.errors.uploadFailed" };

  return { ok: true, path: reserved.data.path };
}
