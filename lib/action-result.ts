/**
 * Return type for every Server Action.
 *
 * Failures carry an i18n message key rather than user-facing text, so the action
 * never has to know which locale is active.
 */
export type ActionResult<T = undefined> =
  { ok: true; data: T } | { ok: false; code: string; fieldErrors?: Record<string, string> };

export function success(): ActionResult;
export function success<T>(data: T): ActionResult<T>;
export function success<T>(data?: T): ActionResult<T | undefined> {
  return { ok: true, data };
}

export function failure(code: string, fieldErrors?: Record<string, string>): ActionResult<never> {
  return { ok: false, code, fieldErrors };
}
