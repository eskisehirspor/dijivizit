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

export const publicCardBankAccountSchema = z.object({
  accountHolder: z.string(),
  iban: z.string(),
  bankName: z.string(),
});

export const publicCardBillingInfoSchema = z.object({
  companyTitle: z.string(),
  companyAddress: z.string(),
  taxNumber: z.string(),
  taxOffice: z.string(),
});

export const publicCardDocumentSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  fileName: z.string(),
  storagePath: z.string(),
});

export const publicCardSchema = z.object({
  publicId: z.string(),
  fullName: z.string().nullable(),
  title: z.string().nullable(),
  company: z.string().nullable(),
  about: z.string().nullable(),
  address: z.string().nullable(),
  avatarPath: z.string().nullable(),
  theme: z.string(),
  locale: z.string(),
  skillsSectionTitle: z.enum(["expertise_areas", "skills"]).default("expertise_areas"),
  bankAccount: publicCardBankAccountSchema.nullable().optional(),
  billingInfo: publicCardBillingInfoSchema.nullable().optional(),
  documents: z.array(publicCardDocumentSchema).default([]),
  links: z.array(publicCardLinkSchema),
  skills: z.array(publicCardSkillSchema),
});

export type PublicCardLink = z.infer<typeof publicCardLinkSchema>;
export type PublicCardSkill = z.infer<typeof publicCardSkillSchema>;
export type PublicCardBankAccount = z.infer<typeof publicCardBankAccountSchema>;
export type PublicCardBillingInfo = z.infer<typeof publicCardBillingInfoSchema>;
export type PublicCardDocument = z.infer<typeof publicCardDocumentSchema>;
export type PublicCard = z.infer<typeof publicCardSchema>;
