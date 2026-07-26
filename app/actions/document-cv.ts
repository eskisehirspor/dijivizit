"use server";

import { revalidatePath } from "next/cache";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { deleteOwnCv, type OwnCvDocument, uploadOwnCv } from "@/lib/dal/documents";
import { getOwnProfile } from "@/lib/dal/profile";
import { routes } from "@/lib/routes";
import { validateCvFile } from "@/lib/validations/document-cv";

export type CvActionData = {
  document: OwnCvDocument | null;
};

async function revalidateCvPaths() {
  revalidatePath(routes.profileCv);
  revalidatePath(routes.dashboard);

  const profile = await getOwnProfile();
  if (profile?.public_id) {
    revalidatePath(routes.publicCard(profile.public_id));
    revalidatePath(routes.publicCv(profile.public_id));
  }
}

export async function uploadCvAction(formData: FormData): Promise<ActionResult<CvActionData>> {
  const file = formData.get("cv");

  if (!(file instanceof File)) {
    return failure("profile.cv.errors.typeInvalid");
  }

  const validated = validateCvFile(file);
  if (!validated.ok) {
    if (validated.code === "size") {
      return failure("profile.cv.errors.tooLarge");
    }
    if (validated.code === "empty") {
      return failure("profile.cv.errors.empty");
    }
    return failure("profile.cv.errors.typeInvalid");
  }

  const result = await uploadOwnCv(file);
  if (!result.ok) {
    return failure("profile.cv.errors.uploadFailed");
  }

  await revalidateCvPaths();
  return success({ document: result.document });
}

export async function deleteCvAction(): Promise<ActionResult<CvActionData>> {
  const result = await deleteOwnCv();
  if (!result.ok) {
    return failure("profile.cv.errors.deleteFailed");
  }

  await revalidateCvPaths();
  return success({ document: null });
}
