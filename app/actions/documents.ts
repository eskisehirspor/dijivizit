"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import {
  createOwnDocument,
  deleteOwnDocument,
  setOwnDocumentVisibility,
  updateOwnDocument,
  type OwnDocument,
} from "@/lib/dal/documents";
import { getOwnProfile } from "@/lib/dal/profile";
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

export async function createDocumentAction(
  _previous: ActionResult<DocumentActionData> | null,
  formData: FormData,
): Promise<ActionResult<DocumentActionData>> {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return failure("profile.documents.errors.typeInvalid");
  }

  const validatedFile = validateDocumentFile(file);
  if (!validatedFile.ok) {
    if (validatedFile.code === "size") {
      return failure("profile.documents.errors.tooLarge");
    }
    if (validatedFile.code === "empty") {
      return failure("profile.documents.errors.empty");
    }
    return failure("profile.documents.errors.typeInvalid");
  }

  const parsed = createDocumentSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description")?.toString() ?? "",
  });

  if (!parsed.success) {
    return failure("profile.documents.errors.uploadFailed", fieldErrorsOf(parsed.error));
  }

  const result = await createOwnDocument({
    file,
    type: parsed.data.type,
    title: parsed.data.title,
    description: parsed.data.description,
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
