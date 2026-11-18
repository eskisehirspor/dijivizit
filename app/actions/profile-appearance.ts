"use server";

import { revalidatePath } from "next/cache";

import { type ActionResult, failure, success } from "@/lib/action-result";
import {
  getOwnAppearance,
  reserveOwnImageUpload,
  setOwnCover,
  setOwnTheme,
  setOwnVanitySlug,
} from "@/lib/dal/profile-appearance";
import { getOwnProfile } from "@/lib/dal/profile";
import { getAvatarUrl } from "@/lib/dal/public-card";
import { routes } from "@/lib/routes";
import { toVanitySlug } from "@/lib/profile/vanity";
import { validateAvatarFile } from "@/lib/validations/profile-avatar";

async function revalidateCard(previousVanity?: string | null) {
  revalidatePath(routes.dashboard);
  revalidatePath(routes.profileAppearance);
  revalidatePath(routes.cardPreview);
  revalidatePath(routes.share);
  const [profile, appearance] = await Promise.all([getOwnProfile(), getOwnAppearance()]);
  if (profile?.public_id) revalidatePath(routes.publicCard(profile.public_id));
  if (appearance?.vanitySlug) revalidatePath(routes.publicCard(appearance.vanitySlug));
  if (previousVanity) revalidatePath(routes.publicCard(previousVanity));
}

export async function setThemeAction(theme: string): Promise<ActionResult> {
  if (!(await setOwnTheme(theme))) return failure("profile.appearance.errors.saveFailed");
  await revalidateCard();
  return success();
}

export async function setVanitySlugAction(
  _previous: ActionResult<{ slug: string | null }> | null,
  formData: FormData,
): Promise<ActionResult<{ slug: string | null }>> {
  const raw = String(formData.get("slug") ?? "");
  const slug = toVanitySlug(raw);
  const before = (await getOwnAppearance())?.vanitySlug ?? null;

  const result = await setOwnVanitySlug(slug);
  if (!result.ok) {
    return failure(`profile.appearance.vanity.errors.${result.code}`, {
      slug: `profile.appearance.vanity.errors.${result.code}`,
    });
  }
  await revalidateCard(before);
  return success({ slug: slug === "" ? null : slug });
}

/** Step 1 of an image upload (cover or product photo): validate and reserve a path. */
export async function reserveImageUploadAction(file: {
  type: string;
  size: number;
}): Promise<ActionResult<{ path: string }>> {
  const validated = validateAvatarFile(file);
  if (!validated.ok) {
    if (validated.code === "size") return failure("profile.avatar.errors.tooLarge");
    if (validated.code === "empty") return failure("profile.avatar.errors.empty");
    return failure("profile.avatar.errors.typeInvalid");
  }
  return success({ path: await reserveOwnImageUpload(validated.mime) });
}

export async function setCoverAction(
  path: string | null,
): Promise<ActionResult<{ coverUrl: string | null }>> {
  if (!(await setOwnCover(path))) return failure("profile.avatar.errors.uploadFailed");
  await revalidateCard();
  return success({ coverUrl: await getAvatarUrl(path) });
}
