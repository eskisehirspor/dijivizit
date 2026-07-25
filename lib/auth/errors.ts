import type { AuthError } from "@supabase/supabase-js";

/**
 * Maps Supabase auth error codes onto i18n message keys.
 *
 * Anything unrecognised collapses to a generic message so that internal detail
 * never reaches the user.
 */
const ERROR_KEY_BY_CODE: Record<string, string> = {
  invalid_credentials: "auth.errors.invalidCredentials",
  email_not_confirmed: "auth.errors.emailNotConfirmed",
  user_already_exists: "auth.errors.emailInUse",
  email_exists: "auth.errors.emailInUse",
  over_request_rate_limit: "auth.errors.rateLimited",
  over_email_send_rate_limit: "auth.errors.rateLimited",
};

export function authErrorKey(error: AuthError): string {
  return (error.code && ERROR_KEY_BY_CODE[error.code]) ?? "auth.errors.unknown";
}

/**
 * Maps the `?error=` tokens our own route handlers redirect with.
 *
 * The token stays opaque and is resolved against this allowlist rather than
 * being a message key itself, so a crafted URL cannot render arbitrary copy on
 * the login page.
 */
const ERROR_KEY_BY_PARAM: Record<string, string> = {
  oauth: "auth.errors.oauthFailed",
  confirm: "auth.errors.confirmFailed",
};

export function pageErrorKey(param: string | null | undefined): string | null {
  if (!param) {
    return null;
  }

  return ERROR_KEY_BY_PARAM[param] ?? "auth.errors.unknown";
}
