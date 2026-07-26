"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { getOwnProfile, setOwnProfilePublished } from "@/lib/dal/profile";
import { routes } from "@/lib/routes";

const publishSchema = z.object({
  published: z.enum(["true", "false"]),
});

export async function setProfilePublishedAction(formData: FormData): Promise<ActionResult> {
  const parsed = publishSchema.safeParse({
    published: formData.get("published"),
  });

  if (!parsed.success) {
    return failure("dashboard.publish.errors.saveFailed");
  }

  const published = parsed.data.published === "true";
  // Resolve the stable public_id before writing so revalidation does not depend
  // on a post-update read of the React-cached getOwnProfile().
  const profile = await getOwnProfile();
  const ok = await setOwnProfilePublished(published);

  if (!ok) {
    return failure("dashboard.publish.errors.saveFailed");
  }

  revalidatePath(routes.dashboard);
  if (profile?.public_id) {
    revalidatePath(routes.publicCard(profile.public_id));
  }

  return success();
}
