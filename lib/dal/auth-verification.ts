import "server-only";

import { clientEnv } from "@/lib/env/client";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";

export type VerificationEmailResult =
  { ok: true } | { ok: false; code: "rate_limited" | "unauthorized" | "failed" };

function mapAuthFailure(code: string | undefined): VerificationEmailResult {
  if (code === "over_request_rate_limit" || code === "over_email_send_rate_limit") {
    return { ok: false, code: "rate_limited" };
  }

  return { ok: false, code: "failed" };
}

/** Resends the signup confirmation email via Supabase Auth. */
export async function resendSignupVerificationEmail(
  email: string,
): Promise<VerificationEmailResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${clientEnv.NEXT_PUBLIC_SITE_URL}${routes.authConfirm}`,
    },
  });

  if (error) {
    return mapAuthFailure(error.code);
  }

  return { ok: true };
}

/**
 * Updates the email on an authenticated but unverified account.
 * Requires an active session — typical post-signup flows have none.
 */
export async function changeUnverifiedEmail(email: string): Promise<VerificationEmailResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || user.email_confirmed_at) {
    return { ok: false, code: "unauthorized" };
  }

  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    return mapAuthFailure(error.code);
  }

  return { ok: true };
}
