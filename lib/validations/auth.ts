import { z } from "zod";

// Messages are i18n keys, not text. They are resolved against messages/tr.json
// at render time so validation logic stays locale-agnostic.

// Length and emptiness are checked before the format, so a blank field reports
// that it is required rather than that it is malformed. z.email() alone cannot
// draw that distinction: "" fails it as an invalid address.
export const emailSchema = z
  .string({ error: "validation.email.required" })
  .trim()
  .min(1, { error: "validation.email.required" })
  .max(254, { error: "validation.email.tooLong" })
  .pipe(z.email({ error: "validation.email.invalid" }));

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

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, { error: "validation.password.required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "validation.password.mismatch",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
