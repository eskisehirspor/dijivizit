"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { authErrorKey } from "@/lib/auth/errors";
import { requestPasswordReset, updatePassword } from "@/lib/dal/auth-password";
import { changeUnverifiedEmail, resendSignupVerificationEmail } from "@/lib/dal/auth-verification";
import { clientEnv } from "@/lib/env/client";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils/safe-redirect";
import {
  emailSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";

/** Keeps the first message per field, keyed by top-level field name. */
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

export async function loginAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    // A malformed submission is not a rejected credential, so it must not claim
    // to be one. The field errors carry the detail the user can act on.
    return failure("auth.errors.unknown", fieldErrorsOf(parsed.error));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    if (error.code === "email_not_confirmed") {
      redirect(`${routes.verifyEmail}?email=${encodeURIComponent(parsed.data.email)}`);
    }

    return failure(authErrorKey(error));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && !user.email_confirmed_at) {
    redirect(`${routes.verifyEmail}?email=${encodeURIComponent(user.email ?? parsed.data.email)}`);
  }

  redirect(safeRedirectPath(formData.get("next")?.toString(), routes.dashboard));
}

export async function registerAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return failure("auth.errors.unknown", fieldErrorsOf(parsed.error));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      // Read by the handle_new_user() trigger to prefill the profile.
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${clientEnv.NEXT_PUBLIC_SITE_URL}${routes.authConfirm}`,
    },
  });

  if (error) {
    return failure(authErrorKey(error));
  }

  // A session comes back only when the project confirms addresses automatically;
  // the cookies are already written, so the account is usable immediately.
  if (data.session) {
    redirect(routes.dashboard);
  }

  // No session means a confirmation mail is pending — or that the address was
  // already taken and Supabase returned a decoy user to avoid confirming its
  // existence to an attacker. Both must look identical here for that protection
  // to hold, so neither is distinguished.
  redirect(`${routes.verifyEmail}?email=${encodeURIComponent(parsed.data.email)}`);
}

// Returns void rather than ActionResult so it can be used directly as a form
// action: both outcomes end in a redirect, so there is no state to hand back.
export async function signInWithGoogleAction(): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${clientEnv.NEXT_PUBLIC_SITE_URL}${routes.authCallback}`,
    },
  });

  if (error || !data.url) {
    redirect(`${routes.login}?error=oauth`);
  }

  redirect(data.url);
}

export async function logoutAction(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect(routes.home);
}

export async function resendVerificationAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = emailSchema.safeParse(formData.get("email"));

  if (!parsed.success) {
    return failure("validation.email.invalid");
  }

  const result = await resendSignupVerificationEmail(parsed.data);

  if (!result.ok) {
    if (result.code === "rate_limited") {
      return failure("auth.errors.rateLimited");
    }

    return failure("auth.verify.resendFailed");
  }

  return success();
}

export async function changeVerificationEmailAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = z.object({ email: emailSchema }).safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return failure("auth.errors.unknown", fieldErrorsOf(parsed.error));
  }

  const result = await changeUnverifiedEmail(parsed.data.email);

  if (!result.ok) {
    if (result.code === "unauthorized") {
      return failure("auth.verify.changeEmailUseRegister");
    }

    if (result.code === "rate_limited") {
      return failure("auth.errors.rateLimited");
    }

    return failure("auth.verify.changeEmailFailed");
  }

  redirect(`${routes.verifyEmail}?email=${encodeURIComponent(parsed.data.email)}`);
}

export async function forgotPasswordAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return failure("auth.errors.unknown", fieldErrorsOf(parsed.error));
  }

  const result = await requestPasswordReset(parsed.data.email);

  if (!result.ok) {
    if (result.code === "rate_limited") {
      return failure("auth.errors.rateLimited");
    }

    return failure("auth.forgotPassword.sendFailed");
  }

  return success();
}

export async function resetPasswordAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return failure("auth.errors.unknown", fieldErrorsOf(parsed.error));
  }

  const result = await updatePassword(parsed.data.password);

  if (!result.ok) {
    if (result.code === "unauthorized") {
      return failure("auth.resetPassword.sessionExpired");
    }

    if (result.code === "rate_limited") {
      return failure("auth.errors.rateLimited");
    }

    return failure("auth.resetPassword.saveFailed");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect(routes.login);
}
