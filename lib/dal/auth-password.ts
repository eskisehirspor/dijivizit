import "server-only";

import { clientEnv } from "@/lib/env/client";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";

export type PasswordResetResult =
  { ok: true } | { ok: false; code: "rate_limited" | "unauthorized" | "failed" };

function mapAuthFailure(code: string | undefined): PasswordResetResult {
  if (code === "over_request_rate_limit" || code === "over_email_send_rate_limit") {
    return { ok: false, code: "rate_limited" };
  }

  return { ok: false, code: "failed" };
}

/**
 * Sends a Supabase recovery email. Always looks successful to the caller when
 * the address is unknown — GoTrue does not reveal whether the user exists.
 *
 * Recovery uses the PKCE code flow (@supabase/ssr). The email must land on
 * /auth/callback (exchangeCodeForSession), not /auth/confirm (verifyOtp /
 * token_hash), which is reserved for email verification OTP links.
 */
export async function requestPasswordReset(email: string): Promise<PasswordResetResult> {
  const supabase = await createClient();
  const redirectTo = new URL(routes.authCallback, clientEnv.NEXT_PUBLIC_SITE_URL);
  redirectTo.searchParams.set("next", routes.resetPassword);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo.toString(),
  });

  if (error) {
    return mapAuthFailure(error.code);
  }

  return { ok: true };
}

/** Sets a new password for the recovery (or authenticated) session. */
export async function updatePassword(password: string): Promise<PasswordResetResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, code: "unauthorized" };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return mapAuthFailure(error.code);
  }

  return { ok: true };
}
