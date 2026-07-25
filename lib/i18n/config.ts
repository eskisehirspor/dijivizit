export const DEFAULT_LOCALE = "tr";

/**
 * V1 ships Turkish only and serves it without a locale segment in the URL.
 *
 * To add a locale later: add its file under messages/, list it here, switch
 * lib/i18n/request.ts to a dynamic import keyed by locale, and move the route
 * groups under app/[locale]/. Nothing else needs to change, because no
 * component holds a hardcoded string.
 */
export const SUPPORTED_LOCALES = [DEFAULT_LOCALE] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** BCP 47 tag used for <html lang> and Intl formatters. */
export const LOCALE_TAG: Record<Locale, string> = {
  tr: "tr-TR",
};
