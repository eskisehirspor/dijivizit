"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { authErrorKey } from "@/lib/auth/errors";
import { clientEnv } from "@/lib/env/client";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils/safe-redirect";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

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
    return failure("auth.errors.invalidCredentials", fieldErrorsOf(parsed.error));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return failure(authErrorKey(error));
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
  return success();
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
