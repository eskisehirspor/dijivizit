"use server";

import { revalidatePath } from "next/cache";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { getOwnProfile } from "@/lib/dal/profile";
import {
  finalizeOwnAvatar,
  removeOwnAvatar,
  reserveOwnAvatarUpload,
} from "@/lib/dal/profile-avatar";
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

/** Step 1: validate the file's declared type/size and reserve a storage path. */
export async function reserveAvatarUploadAction(file: {
  type: string;
  size: number;
}): Promise<ActionResult<{ path: string }>> {
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

  return success({ path: await reserveOwnAvatarUpload(validated.mime) });
}

/** Step 3: the browser has stored the file; make it the profile photo. */
export async function finalizeAvatarUploadAction(
  path: string,
): Promise<ActionResult<AvatarActionData>> {
  const result = await finalizeOwnAvatar(path);

  if (!result.ok) {
    return failure("profile.avatar.errors.uploadFailed");
  }

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
