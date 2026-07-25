import { z } from "zod";

// Messages are i18n keys, not text. They are resolved against messages/tr.json
// at render time so validation logic stays locale-agnostic.

export const emailSchema = z
  .email({ error: "validation.email.invalid" })
  .max(254, { error: "validation.email.tooLong" });

export const passwordSchema = z
  .string()
  .min(8, { error: "validation.password.tooShort" })
  // bcrypt silently ignores anything past 72 bytes, so accepting longer inputs
  // would let two different passwords unlock the same account.
  .max(72, { error: "validation.password.tooLong" });

export const fullNameSchema = z
  .string()
  .trim()
  .min(2, { error: "validation.fullName.tooShort" })
  .max(120, { error: "validation.fullName.tooLong" });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: "validation.password.required" }),
});

export const registerSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
