import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/utils/safe-redirect";

const VALID_OTP_TYPES: readonly EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
];

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return value !== null && (VALID_OTP_TYPES as readonly string[]).includes(value);
}

/** Landing point for email OTP links (token_hash): signup confirmation, etc.
 * Password recovery uses the PKCE code flow on /auth/callback instead.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  // token_hash recovery templates (if any) still land here; PKCE recovery does not.
  const defaultNext = type === "recovery" ? routes.resetPassword : routes.dashboard;
  const next = safeRedirectPath(searchParams.get("next"), defaultNext);

  const failureUrl = new URL(routes.login, origin);
  failureUrl.searchParams.set("error", "confirm");

  if (!tokenHash || !isEmailOtpType(type)) {
    return NextResponse.redirect(failureUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

  if (error) {
    return NextResponse.redirect(failureUrl);
  }

  return NextResponse.redirect(new URL(next, origin));
}
