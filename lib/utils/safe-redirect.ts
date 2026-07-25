/**
 * Constrains a caller-supplied redirect target to a path on this origin.
 *
 * `next` arrives from the query string, so without this an attacker could send
 * `?next=https://evil.example` and turn the login flow into an open redirect.
 * Protocol-relative values like `//evil.example` are rejected for the same reason.
 */
export function safeRedirectPath(value: string | null | undefined, fallback: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}
