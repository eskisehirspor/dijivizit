import type { User } from "@supabase/supabase-js";

function trimOrNull(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Display name from Google (or other OAuth) user metadata. */
export function fullNameFromUserMetadata(
  metadata: User["user_metadata"] | null | undefined,
): string | null {
  return trimOrNull(metadata?.full_name) ?? trimOrNull(metadata?.name);
}

/** Profile photo URL from Google (or other OAuth) user metadata. */
export function avatarUrlFromUserMetadata(
  metadata: User["user_metadata"] | null | undefined,
): string | null {
  return trimOrNull(metadata?.picture) ?? trimOrNull(metadata?.avatar_url);
}
