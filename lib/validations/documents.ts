import { z } from "zod";

import {
  DOCUMENT_MAX_BYTES,
  DOCUMENT_TYPES,
  isDocumentMimeType,
  type DocumentMimeType,
} from "@/lib/profile/documents";

export type DocumentFileInput = {
  type: string;
  size: number;
  name: string;
};

export type DocumentFileValidationResult =
  { ok: true; mime: DocumentMimeType } | { ok: false; code: "empty" | "type" | "size" };

/** Shared MIME + size checks for document PDF uploads (reused from the CV flow). */
export function validateDocumentFile(file: DocumentFileInput): DocumentFileValidationResult {
  if (file.size <= 0 || !file.name.trim()) {
    return { ok: false, code: "empty" };
  }

  if (!isDocumentMimeType(file.type)) {
    return { ok: false, code: "type" };
  }

  if (file.size > DOCUMENT_MAX_BYTES) {
    return { ok: false, code: "size" };
  }

  return { ok: true, mime: file.type };
}

export const createDocumentSchema = z.object({
  type: z.enum(DOCUMENT_TYPES, { error: "validation.document.typeInvalid" }),
  title: z
    .string({ error: "validation.document.titleRequired" })
    .trim()
    .min(1, { error: "validation.document.titleRequired" })
    .max(200, { error: "validation.document.titleTooLong" }),
  description: z
    .string()
    .trim()
    .max(500, { error: "validation.document.descriptionTooLong" })
    .optional()
    .transform((value) => (!value || value.length === 0 ? null : value)),
});

export const updateDocumentSchema = createDocumentSchema.extend({
  id: z.uuid({ error: "validation.document.idInvalid" }),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
