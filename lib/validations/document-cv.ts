import { CV_MAX_BYTES, isCvMimeType, type CvMimeType } from "@/lib/profile/documents";

export type CvFileInput = {
  type: string;
  size: number;
  name: string;
};

export type CvValidationResult =
  { ok: true; mime: CvMimeType } | { ok: false; code: "empty" | "type" | "size" };

/** Shared MIME + size checks for CV PDF uploads. */
export function validateCvFile(file: CvFileInput): CvValidationResult {
  if (file.size <= 0 || !file.name.trim()) {
    return { ok: false, code: "empty" };
  }

  if (!isCvMimeType(file.type)) {
    return { ok: false, code: "type" };
  }

  if (file.size > CV_MAX_BYTES) {
    return { ok: false, code: "size" };
  }

  return { ok: true, mime: file.type };
}
