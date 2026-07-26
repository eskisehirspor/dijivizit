import { NextResponse, type NextRequest } from "next/server";

import { syncOAuthProfile } from "@/lib/auth/sync-oauth-profile";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils/safe-redirect";

/** OAuth (PKCE) landing point. Exchanges the one-time code for a session. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"), routes.dashboard);

  const failureUrl = new URL(routes.login, origin);
  failureUrl.searchParams.set("error", "oauth");

  if (!code) {
    return NextResponse.redirect(failureUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(failureUrl);
  }

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

  return NextResponse.redirect(new URL(next, origin));
}
