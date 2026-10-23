"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { changeOwnEmail, changeOwnPassword, deleteOwnAccount } from "@/lib/dal/account";
import { routes } from "@/lib/routes";
import { emailSchema, passwordSchema } from "@/lib/validations/auth";

const ERROR_KEYS = {
  wrong_password: "settings.errors.wrongPassword",
  same_email: "settings.errors.sameEmail",
  email_taken: "settings.errors.emailTaken",
  rate_limited: "settings.errors.rateLimited",
  weak: "settings.errors.weak",
  failed: "settings.errors.failed",
} as const;

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

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().max(72),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, { error: "validation.password.required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "validation.password.mismatch",
    path: ["confirmPassword"],
  });

export async function changePasswordAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = passwordChangeSchema.safeParse({
    currentPassword: formData.get("currentPassword") ?? "",
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return failure("settings.errors.failed", fieldErrorsOf(parsed.error));
  }

  const result = await changeOwnPassword(parsed.data);
  if (!result.ok) {
    return result.code === "wrong_password"
      ? failure(ERROR_KEYS.wrong_password, { currentPassword: ERROR_KEYS.wrong_password })
      : failure(ERROR_KEYS[result.code]);
  }

  return success();
}

export async function changeEmailAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = z.object({ email: emailSchema }).safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return failure("settings.errors.failed", fieldErrorsOf(parsed.error));
  }

  const result = await changeOwnEmail(parsed.data.email);
  if (!result.ok) {
    return failure(ERROR_KEYS[result.code], { email: ERROR_KEYS[result.code] });
  }

  return success();
}

export async function deleteAccountAction(confirmation: string): Promise<ActionResult> {
  if (confirmation.trim().toLocaleUpperCase("tr-TR") !== "SİL") {
    return failure("settings.delete.confirmMismatch");
  }

  const result = await deleteOwnAccount();
  if (!result.ok) {
    return failure(ERROR_KEYS.failed);
  }

  redirect(`${routes.login}?deleted=1`);
}
