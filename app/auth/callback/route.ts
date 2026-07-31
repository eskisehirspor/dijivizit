import { NextResponse, type NextRequest } from "next/server";

import { syncOAuthProfile } from "@/lib/auth/sync-oauth-profile";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils/safe-redirect";

/**
 * PKCE landing point for flows that return an auth `code`:
 * - OAuth (Google)
 * - Password recovery (resetPasswordForEmail)
 *
 * Email verification OTP links (token_hash + type) use /auth/confirm instead.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"), routes.dashboard);
  const isPasswordRecovery = next === routes.resetPassword;

  const failureUrl = new URL(routes.login, origin);
  // Recovery failures are expired/invalid email links, not OAuth errors.
  failureUrl.searchParams.set("error", isPasswordRecovery ? "confirm" : "oauth");

  if (!code) {
    return NextResponse.redirect(failureUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(failureUrl);
  }

  // OAuth-only enrichment. Recovery sessions are email/password accounts.
  if (!isPasswordRecovery) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Best-effort: never block sign-in if Google avatar import fails.
      try {
        await syncOAuthProfile(user);
      } catch {
        // Profile trigger already created the row; enrichment is optional.
      }
    }
  }

  return NextResponse.redirect(new URL(next, origin));
}
