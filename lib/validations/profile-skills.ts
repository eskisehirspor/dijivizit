import { z } from "zod";

import { PROFILE_SKILL_TYPES } from "@/lib/profile/skill-types";

export const skillNameSchema = z
  .string({ error: "validation.skill.nameRequired" })
  .trim()
  .min(1, { error: "validation.skill.nameRequired" })
  .max(60, { error: "validation.skill.nameTooLong" });

export const skillTypeSchema = z.enum(PROFILE_SKILL_TYPES, {
  error: "validation.skill.typeInvalid",
});

export const createProfileSkillSchema = z.object({
  name: skillNameSchema,
  type: skillTypeSchema,
});

export const updateProfileSkillSchema = z.object({
  id: z.uuid({ error: "validation.skill.idInvalid" }),
  name: skillNameSchema,
  type: skillTypeSchema,
});

export type CreateProfileSkillInput = z.infer<typeof createProfileSkillSchema>;
export type UpdateProfileSkillInput = z.infer<typeof updateProfileSkillSchema>;
