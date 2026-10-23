"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import {
  deleteOwnDocument,
  finalizeOwnDocument,
  reserveOwnDocumentUpload,
  setOwnDocumentVisibility,
  updateOwnDocument,
  type OwnDocument,
} from "@/lib/dal/documents";
import { getOwnProfile } from "@/lib/dal/profile";
import type { DocumentType } from "@/lib/profile/documents";
import { routes } from "@/lib/routes";
import {
  createDocumentSchema,
  updateDocumentSchema,
  validateDocumentFile,
} from "@/lib/validations/documents";

export type DocumentActionData = {
  document: OwnDocument | null;
};

function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === "string" && !(field in result)) {
      result[field] = issue.message;
    }
  }

  return result;
}

async function revalidateDocumentPaths(documentId?: string) {
  revalidatePath(routes.profileDocuments);
  revalidatePath(routes.dashboard);

  const profile = await getOwnProfile();
  if (profile?.public_id) {
    revalidatePath(routes.publicCard(profile.public_id));
    if (documentId) {
      revalidatePath(routes.publicDocument(profile.public_id, documentId));
    }
  }
}

export type DocumentUploadMeta = {
  fileName: string;
  fileType: string;
  fileSize: number;
  type: string;
  title: string;
  description: string;
};

function validateUploadMeta(
  meta: DocumentUploadMeta,
):
  | { ok: true; data: { type: DocumentType; title: string; description: string | null } }
  | { ok: false; result: ActionResult<never> } {
  const validatedFile = validateDocumentFile({
    name: meta.fileName,
    type: meta.fileType,
    size: meta.fileSize,
  });

  if (!validatedFile.ok) {
    const code =
      validatedFile.code === "size"
        ? "profile.documents.errors.tooLarge"
        : validatedFile.code === "empty"
          ? "profile.documents.errors.empty"
          : "profile.documents.errors.typeInvalid";
    return { ok: false, result: failure(code) };
  }

  const parsed = createDocumentSchema.safeParse({
    type: meta.type,
    title: meta.title,
    description: meta.description,
  });

  if (!parsed.success) {
    return {
      ok: false,
      result: failure("profile.documents.errors.uploadFailed", fieldErrorsOf(parsed.error)),
    };
  }

  return { ok: true, data: parsed.data };
}

/** Step 1 of an upload: validate the form and reserve a storage path. */
export async function reserveDocumentUploadAction(
  meta: DocumentUploadMeta,
): Promise<ActionResult<{ path: string }>> {
  const validated = validateUploadMeta(meta);
  if (!validated.ok) {
    return validated.result;
  }

  const slot = await reserveOwnDocumentUpload();
  if (!slot.ok) {
    return failure("profile.documents.errors.limitReached");
  }

  return success({ path: slot.path });
}

/** Step 3 of an upload: the browser has stored the file; record it. */
export async function finalizeDocumentUploadAction(
  path: string,
  meta: DocumentUploadMeta,
): Promise<ActionResult<DocumentActionData>> {
  const validated = validateUploadMeta(meta);
  if (!validated.ok) {
    return validated.result;
  }

  const result = await finalizeOwnDocument({
    path,
    fileName: meta.fileName,
    ...validated.data,
  });

  if (!result.ok) {
    if (result.code === "limit") {
      return failure("profile.documents.errors.limitReached");
    }
    return failure("profile.documents.errors.uploadFailed");
  }

  await revalidateDocumentPaths(result.document.id);
  return success({ document: result.document });
}

export async function updateDocumentAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = updateDocumentSchema.safeParse({
    id: formData.get("id"),
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description")?.toString() ?? "",
  });

  if (!parsed.success) {
    return failure("profile.documents.errors.updateFailed", fieldErrorsOf(parsed.error));
  }

  const ok = await updateOwnDocument(parsed.data);
  if (!ok) {
    return failure("profile.documents.errors.updateFailed");
  }

  await revalidateDocumentPaths(parsed.data.id);
  return success();
}

export async function toggleDocumentVisibilityAction(
  id: string,
  isVisible: boolean,
): Promise<ActionResult> {
  const ok = await setOwnDocumentVisibility(id, isVisible);
  if (!ok) {
    return failure("profile.documents.errors.updateFailed");
  }

  await revalidateDocumentPaths(id);
  return success();
}

export async function deleteDocumentAction(id: string): Promise<ActionResult> {
  const result = await deleteOwnDocument(id);
  if (!result.ok) {
    return failure("profile.documents.errors.deleteFailed");
  }

  await revalidateDocumentPaths(id);
  return success();
}
