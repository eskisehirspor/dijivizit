import { getRequestConfig } from "next-intl/server";

import { DEFAULT_LOCALE, type Locale } from "./config";
import { messagesFor } from "./messages";

// Turkish everywhere, unless a public card asks for English explicitly via
// getTranslations({ locale: "en" }) / getMessages({ locale: "en" }).
export default getRequestConfig(async ({ locale }) => {
  const resolved: Locale = locale === "en" ? "en" : DEFAULT_LOCALE;
  return { locale: resolved, messages: messagesFor(resolved) as never };
});
