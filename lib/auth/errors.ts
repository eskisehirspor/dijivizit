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
