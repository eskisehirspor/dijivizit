import { AVATAR_MAX_BYTES, isAvatarMimeType, type AvatarMimeType } from "@/lib/profile/avatar";

export type AvatarFileInput = {
  type: string;
  size: number;
};

export type AvatarValidationResult =
  { ok: true; mime: AvatarMimeType } | { ok: false; code: "empty" | "type" | "size" };

/**
 * Shared MIME + size checks for avatar uploads.
 * Dimensions and format conversion are intentionally out of scope.
 */
export function validateAvatarFile(file: AvatarFileInput): AvatarValidationResult {
  if (file.size <= 0) {
    return { ok: false, code: "empty" };
  }

  if (!isAvatarMimeType(file.type)) {
    return { ok: false, code: "type" };
  }

  if (file.size > AVATAR_MAX_BYTES) {
    return { ok: false, code: "size" };
  }

  return { ok: true, mime: file.type };
}
