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

  // A brand-new Google identity without a matching invitation is rejected by
  // the enforce_signup_invitation trigger; GoTrue reports that as a database
  // error on user creation. Say so, instead of a generic OAuth failure.
  const providerError = searchParams.get("error_description") ?? "";
  if (!code && /database error saving new user|invitation_required/i.test(providerError)) {
    failureUrl.searchParams.set("error", "invite");
    return NextResponse.redirect(failureUrl);
  }

  // Email-change links: with secure email change the first click carries no
  // code, and a link opened in another browser/mail app can't redeem the PKCE
  // code. Supabase has already recorded the confirmation either way, so this is
  // not an OAuth failure: send the user to Settings with a neutral notice.
  const isEmailChange = next === routes.settings;
  const emailChangeUrl = new URL(routes.settings, origin);
  emailChangeUrl.searchParams.set("email", "pending");

  if (!code) {
    return NextResponse.redirect(isEmailChange ? emailChangeUrl : failureUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(isEmailChange ? emailChangeUrl : failureUrl);
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
