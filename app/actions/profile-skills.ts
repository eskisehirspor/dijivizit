"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import {
  createOwnProfileSkill,
  deleteOwnProfileSkill,
  moveOwnProfileSkill,
  updateOwnProfileSkill,
} from "@/lib/dal/profile-skills";
import { routes } from "@/lib/routes";
import {
  createProfileSkillSchema,
  updateProfileSkillSchema,
} from "@/lib/validations/profile-skills";

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

function revalidateSkills() {
  revalidatePath(routes.profileSkills);
  revalidatePath(routes.dashboard);
}

export async function createProfileSkillAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = createProfileSkillSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
  });

  if (!parsed.success) {
    return failure("profile.skills.errors.saveFailed", fieldErrorsOf(parsed.error));
  }

  const result = await createOwnProfileSkill(parsed.data);

  if (!result.ok) {
    if (result.code === "limit") {
      return failure("profile.skills.errors.limitReached");
    }
    if (result.code === "duplicate") {
      return failure("profile.skills.errors.duplicate", {
        name: "validation.skill.duplicate",
      });
    }
    return failure("profile.skills.errors.saveFailed");
  }

  revalidateSkills();
  return success();
}

export async function updateProfileSkillAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = updateProfileSkillSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    type: formData.get("type"),
  });

  if (!parsed.success) {
    return failure("profile.skills.errors.saveFailed", fieldErrorsOf(parsed.error));
  }

  const result = await updateOwnProfileSkill(parsed.data);

  if (!result.ok) {
    if (result.code === "duplicate") {
      return failure("profile.skills.errors.duplicate", {
        name: "validation.skill.duplicate",
      });
    }
    return failure("profile.skills.errors.saveFailed");
  }

  revalidateSkills();
  return success();
}

export async function deleteProfileSkillAction(id: string): Promise<ActionResult> {
  const ok = await deleteOwnProfileSkill(id);

  if (!ok) {
    return failure("profile.skills.errors.deleteFailed");
  }

  revalidateSkills();
  return success();
}

export async function moveProfileSkillAction(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  const ok = await moveOwnProfileSkill(id, direction);

  if (!ok) {
    return failure("profile.skills.errors.reorderFailed");
  }

  revalidateSkills();
  return success();
}
