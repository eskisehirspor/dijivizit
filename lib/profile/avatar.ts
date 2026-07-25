export const AVATAR_BUCKET = "avatars";

export const AVATAR_MAX_BYTES = 2_097_152; // 2 MiB — matches the storage bucket limit

export const AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type AvatarMimeType = (typeof AVATAR_MIME_TYPES)[number];

const EXTENSION_BY_MIME: Record<AvatarMimeType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function isAvatarMimeType(value: string): value is AvatarMimeType {
  return (AVATAR_MIME_TYPES as readonly string[]).includes(value);
}

export function extensionForAvatarMime(mime: AvatarMimeType): string {
  return EXTENSION_BY_MIME[mime];
}
