import { z } from "zod";

import { fullNameSchema } from "@/lib/validations/auth";
import {
  DEFAULT_SKILLS_SECTION_TITLE,
  SKILLS_SECTION_TITLES,
} from "@/lib/profile/skills-section-title";

/** Blank optional strings become null so the DB stores absence, not "". */
function optionalText(max: number, tooLongKey: string) {
  return z
    .string()
    .trim()
    .max(max, { error: tooLongKey })
    .transform((value) => (value.length === 0 ? null : value));
}

export const basicProfileSchema = z.object({
  fullName: fullNameSchema,
  title: optionalText(120, "validation.title.tooLong"),
  company: optionalText(120, "validation.company.tooLong"),
  about: optionalText(5000, "validation.about.tooLong"),
  address: optionalText(500, "validation.address.tooLong"),
  skillsSectionTitle: z
    .enum(SKILLS_SECTION_TITLES, { error: "validation.skillsSectionTitle.invalid" })
    .default(DEFAULT_SKILLS_SECTION_TITLE),
});

export type BasicProfileInput = z.infer<typeof basicProfileSchema>;

export const ABOUT_MAX_LENGTH = 5000;
export const ADDRESS_MAX_LENGTH = 500;
