import "server-only";

import type { User } from "@supabase/supabase-js";

import { avatarUrlFromUserMetadata, fullNameFromUserMetadata } from "@/lib/auth/oauth-metadata";
import {
  AVATAR_BUCKET,
  AVATAR_MAX_BYTES,
  extensionForAvatarMime,
  isAvatarMimeType,
} from "@/lib/profile/avatar";
import { createClient } from "@/lib/supabase/server";

/**
 * Ensures the profile row exists and backfills full_name / avatar from OAuth
 * metadata on first login. Never overwrites an existing name or avatar.
 * Email stays on auth.users (not profiles). public_id is assigned by trigger.
 */
export async function syncOAuthProfile(user: User): Promise<void> {
  const supabase = await createClient();
  const fullName = fullNameFromUserMetadata(user.user_metadata);
  const pictureUrl = avatarUrlFromUserMetadata(user.user_metadata);

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_path")
    .eq("id", user.id)
    .maybeSingle();

  // Profile is created by handle_new_user() on auth.users insert. If it's
  // missing, skip enrichment rather than fighting the public_id trigger.
  if (!profile) {
    return;
  }

  const updates: { full_name?: string; avatar_path?: string } = {};

  if (!profile.full_name && fullName) {
    updates.full_name = fullName;
  }

  if (!profile.avatar_path && pictureUrl) {
    const avatarPath = await importRemoteAvatar(user.id, pictureUrl);
    if (avatarPath) {
      updates.avatar_path = avatarPath;
    }
  }

  if (Object.keys(updates).length === 0) {
    return;
  }

  await supabase.from("profiles").update(updates).eq("id", user.id);
}

async function importRemoteAvatar(userId: string, pictureUrl: string): Promise<string | null> {
  try {
    const response = await fetch(pictureUrl);
    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    const mime = blob.type.split(";")[0]?.trim() ?? "";

    if (!isAvatarMimeType(mime) || blob.size <= 0 || blob.size > AVATAR_MAX_BYTES) {
      return null;
    }

    const extension = extensionForAvatarMime(mime);
    const nextPath = `${userId}/${crypto.randomUUID()}.${extension}`;
    const supabase = await createClient();
    const buffer = Buffer.from(await blob.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(nextPath, buffer, {
        contentType: mime,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      return null;
    }

    return nextPath;
  } catch {
    return null;
  }
}
