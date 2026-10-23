/**
 * Constrains a caller-supplied redirect target to a path on this origin.
 *
 * `next` arrives from the query string, so without this an attacker could send
 * `?next=https://evil.example` and turn the login flow into an open redirect.
 * Protocol-relative values like `//evil.example` are rejected for the same
 * reason, and so are backslashes and control characters: browsers normalise
 * `/\evil.example` to `//evil.example`.
 */
export function safeRedirectPath(value: string | null | undefined, fallback: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  // eslint-disable-next-line no-control-regex -- rejecting control characters is the point
  if (/[\\\u0000-\u001f\u007f]/.test(value)) {
    return fallback;
  }

  // Final guard: whatever the string looks like, it must resolve on our origin.
  try {
    const base = "https://origin.invalid";
    const resolved = new URL(value, base);
    if (resolved.origin !== base) {
      return fallback;
    }
    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return fallback;
  }
}
