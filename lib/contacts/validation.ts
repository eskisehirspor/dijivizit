import { z } from "zod";

import { normalizeTurkishPhone } from "@/lib/orders/validation";

/** Turkish numbers become +90XXXXXXXXXX; other international numbers keep
 * their digits with a leading +. Returns null when it can't be a phone. */
export function normalizeContactPhone(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const tr = normalizeTurkishPhone(trimmed);
  if (tr) return tr;
  const digits = trimmed.replace(/[^\d]/g, "");
  if (trimmed.startsWith("+") || trimmed.startsWith("00")) {
    const intl = trimmed.startsWith("00") ? digits.slice(2) : digits;
    if (intl.length >= 8 && intl.length <= 15) return `+${intl}`;
  }
  return null;
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: "contacts.errors.tooLong" })
    .optional()
    .transform((v) => (v ? v : null));

const phoneField = z
  .string()
  .trim()
  .optional()
  .transform((v, ctx) => {
    if (!v) return null;
    const normalized = normalizeContactPhone(v);
    if (!normalized) {
      ctx.addIssue({ code: "custom", message: "contacts.errors.phone" });
      return z.NEVER;
    }
    return normalized;
  });

const emailField = z
  .string()
  .trim()
  .optional()
  .transform((v, ctx) => {
    if (!v) return null;
    const parsed = z.email().max(254).safeParse(v.toLowerCase());
    if (!parsed.success) {
      ctx.addIssue({ code: "custom", message: "contacts.errors.email" });
      return z.NEVER;
    }
    return parsed.data;
  });

const nameField = z
  .string({ error: "contacts.errors.name" })
  .trim()
  .min(2, { error: "contacts.errors.name" })
  .max(120, { error: "contacts.errors.tooLong" });

function reachable<T extends { phone: string | null; email: string | null }>(
  data: T,
  ctx: z.RefinementCtx,
) {
  if (!data.phone && !data.email) {
    ctx.addIssue({ code: "custom", path: ["phone"], message: "contacts.errors.reachable" });
  }
}

/** What a visitor leaves on a public card. */
export const cardContactSchema = z
  .object({
    fullName: nameField,
    phone: phoneField,
    email: emailField,
    company: optionalText(120),
    message: optionalText(1000),
    consent: z.literal("on", { error: "contacts.errors.consent" }),
  })
  .superRefine(reachable);

export type CardContactInput = z.infer<typeof cardContactSchema>;

export function parseTags(raw: string): string[] {
  const seen = new Set<string>();
  for (const part of raw.split(/[,;\n]/)) {
    const tag = part.trim().replace(/^#/, "").slice(0, 30);
    if (tag) seen.add(tag.toLocaleLowerCase("tr-TR"));
    if (seen.size >= 10) break;
  }
  return [...seen];
}

/** A contact the owner adds or edits in the dashboard. */
export const contactSchema = z
  .object({
    fullName: nameField,
    phone: phoneField,
    email: emailField,
    company: optionalText(120),
    title: optionalText(120),
    metWhere: optionalText(120),
    tags: z
      .string()
      .optional()
      .transform((v) => parseTags(v ?? "")),
  })
  .superRefine(reachable);

export type ContactInput = z.infer<typeof contactSchema>;

export const noteSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, { error: "contacts.errors.noteEmpty" })
    .max(2000, { error: "contacts.errors.tooLong" }),
});

export const followUpSchema = z.object({
  dueOn: z.iso.date({ error: "contacts.errors.date" }),
  note: optionalText(200),
});
