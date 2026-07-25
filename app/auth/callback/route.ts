import { NextResponse, type NextRequest } from "next/server";

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

  return NextResponse.redirect(new URL(next, origin));
}
