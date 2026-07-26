"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { getOwnProfile, updateOwnBasicProfile } from "@/lib/dal/profile";
import { routes } from "@/lib/routes";
import { basicProfileSchema } from "@/lib/validations/profile";

/** Keeps the first message per field, keyed by top-level field name. */
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

export async function updateBasicProfileAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = basicProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    title: formData.get("title"),
    company: formData.get("company"),
    about: formData.get("about"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    return failure("profile.errors.saveFailed", fieldErrorsOf(parsed.error));
  }

  const profile = await getOwnProfile();

  try {
    await updateOwnBasicProfile(parsed.data);
  } catch {
    return failure("profile.errors.saveFailed");
  }

  revalidatePath(routes.dashboard);
  revalidatePath(routes.profileEdit);
  revalidatePath(routes.share);
  if (profile?.public_id) {
    revalidatePath(routes.publicCard(profile.public_id));
    revalidatePath(routes.publicVcard(profile.public_id));
  }

  return success();
}
