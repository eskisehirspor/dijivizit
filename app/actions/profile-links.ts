"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { getOwnProfile } from "@/lib/dal/profile";
import {
  createOwnProfileLink,
  deleteOwnProfileLink,
  getOwnProfileLinks,
  moveOwnProfileLink,
  setOwnProfileLinkVisibility,
  updateOwnProfileLink,
} from "@/lib/dal/profile-links";
import { routes } from "@/lib/routes";
import { createProfileLinkSchema, updateProfileLinkSchema } from "@/lib/validations/profile-links";

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

async function revalidateLinks() {
  revalidatePath(routes.profileLinks);
  revalidatePath(routes.dashboard);
  revalidatePath(routes.share);

  const profile = await getOwnProfile();
  if (profile?.public_id) {
    revalidatePath(routes.publicCard(profile.public_id));
    revalidatePath(routes.publicVcard(profile.public_id));
  }
}

export async function createProfileLinkAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = createProfileLinkSchema.safeParse({
    platform: formData.get("platform"),
    value: formData.get("value"),
    label: formData.get("label")?.toString() ?? "",
  });

  if (!parsed.success) {
    return failure("profile.links.errors.saveFailed", fieldErrorsOf(parsed.error));
  }

  const result = await createOwnProfileLink(parsed.data);

  if (!result.ok) {
    return failure(
      result.code === "limit"
        ? "profile.links.errors.limitReached"
        : "profile.links.errors.saveFailed",
    );
  }

  await revalidateLinks();
  return success();
}

export async function updateProfileLinkAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = formData.get("id")?.toString() ?? "";
  const links = await getOwnProfileLinks();
  const existing = links.find((link) => link.id === id);

  if (!existing) {
    return failure("profile.links.errors.saveFailed");
  }

  const parsed = updateProfileLinkSchema.safeParse({
    id,
    value: formData.get("value"),
    platform: existing.platform,
    label: formData.get("label")?.toString() ?? "",
  });

  if (!parsed.success) {
    return failure("profile.links.errors.saveFailed", fieldErrorsOf(parsed.error));
  }

  const ok = await updateOwnProfileLink({
    id: parsed.data.id,
    value: parsed.data.value,
    label: parsed.data.label,
  });

  if (!ok) {
    return failure("profile.links.errors.saveFailed");
  }

  await revalidateLinks();
  return success();
}

export async function toggleProfileLinkVisibilityAction(
  id: string,
  isVisible: boolean,
): Promise<ActionResult> {
  const ok = await setOwnProfileLinkVisibility(id, isVisible);

  if (!ok) {
    return failure("profile.links.errors.saveFailed");
  }

  await revalidateLinks();
  return success();
}

export async function deleteProfileLinkAction(id: string): Promise<ActionResult> {
  const ok = await deleteOwnProfileLink(id);

  if (!ok) {
    return failure("profile.links.errors.deleteFailed");
  }

  await revalidateLinks();
  return success();
}

export async function moveProfileLinkAction(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  const ok = await moveOwnProfileLink(id, direction);

  if (!ok) {
    return failure("profile.links.errors.reorderFailed");
  }

  await revalidateLinks();
  return success();
}
