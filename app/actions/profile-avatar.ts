"use server";

import { revalidatePath } from "next/cache";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { getOwnProfile } from "@/lib/dal/profile";
import { removeOwnAvatar, uploadOwnAvatar } from "@/lib/dal/profile-avatar";
import { getAvatarUrl } from "@/lib/dal/public-card";
import { routes } from "@/lib/routes";
import { validateAvatarFile } from "@/lib/validations/profile-avatar";

export type AvatarActionData = {
  avatarUrl: string | null;
};

async function revalidateAvatar() {
  revalidatePath(routes.profileAvatar);
  revalidatePath(routes.dashboard);
  revalidatePath(routes.profileEdit);

  const profile = await getOwnProfile();
  if (profile?.public_id) {
    revalidatePath(routes.publicCard(profile.public_id));
  }
}

export async function uploadAvatarAction(
  formData: FormData,
): Promise<ActionResult<AvatarActionData>> {
  const file = formData.get("avatar");

  if (!(file instanceof File)) {
    return failure("profile.avatar.errors.typeInvalid");
  }

  const validated = validateAvatarFile(file);

  if (!validated.ok) {
    if (validated.code === "size") {
      return failure("profile.avatar.errors.tooLarge");
    }
    if (validated.code === "empty") {
      return failure("profile.avatar.errors.empty");
    }
    return failure("profile.avatar.errors.typeInvalid");
  }

  const result = await uploadOwnAvatar(file, validated.mime);

  if (!result.ok) {
    return failure("profile.avatar.errors.uploadFailed");
  }

  // Resolve from the path returned by the DAL — do not re-read getOwnProfile()
  // here, because React cache() may still hold the pre-upload row in this request.
  const avatarUrl = await getAvatarUrl(result.path);

  await revalidateAvatar();
  return success({ avatarUrl });
}

export async function removeAvatarAction(): Promise<ActionResult<AvatarActionData>> {
  const result = await removeOwnAvatar();

  if (!result.ok) {
    return failure("profile.avatar.errors.removeFailed");
  }

  await revalidateAvatar();
  return success({ avatarUrl: null });
}
