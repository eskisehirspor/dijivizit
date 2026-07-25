import { z } from "zod";

/**
 * Shape returned by the public.get_public_card() database function.
 *
 * The function hands back untyped jsonb, so this schema is the boundary that
 * turns it into something the UI can trust.
 */
export const publicCardLinkSchema = z.object({
  platform: z.string(),
  label: z.string().nullable(),
  /**
   * Raw value, not a URI: a bare phone number, an address, or a URL depending on
   * `platform`. The card composes the href, and a vCard reads the same field.
   */
  value: z.string(),
});

export const publicCardSkillSchema = z.object({
  name: z.string(),
  type: z.enum(["expertise", "skill"]),
});

export const publicCardSchema = z.object({
  publicId: z.string(),
  fullName: z.string().nullable(),
  title: z.string().nullable(),
  company: z.string().nullable(),
  about: z.string().nullable(),
  avatarPath: z.string().nullable(),
  theme: z.string(),
  locale: z.string(),
  links: z.array(publicCardLinkSchema),
  skills: z.array(publicCardSkillSchema),
});

export type PublicCardLink = z.infer<typeof publicCardLinkSchema>;
export type PublicCardSkill = z.infer<typeof publicCardSkillSchema>;
export type PublicCard = z.infer<typeof publicCardSchema>;
