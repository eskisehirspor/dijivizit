import { DEFAULT_LOCALE, LOCALE_TAG, type Locale } from "./config";

/**
 * All date and number formatting goes through these helpers rather than raw
 * `toLocaleString` calls, so switching or adding a locale is a change in one place.
 */

export function formatDate(
  value: Date | string,
  locale: Locale = DEFAULT_LOCALE,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], options).format(date);
}

export function formatNumber(
  value: number,
  locale: Locale = DEFAULT_LOCALE,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale], options).format(value);
}
