/** Length and alphabet must stay in sync with public.generate_public_id(). */
export const PUBLIC_ID_LENGTH = 11;

const PUBLIC_ID_PATTERN = /^[0-9A-Za-z]{11}$/;

/**
 * Cheap shape check used to reject obviously invalid ids before they reach the
 * database, so scanning for valid cards costs an attacker a 404 rather than a query.
 */
export function isValidPublicId(value: string): boolean {
  return PUBLIC_ID_PATTERN.test(value);
}
