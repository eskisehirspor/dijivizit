import en from "@/messages/en.json";
import tr from "@/messages/tr.json";

import type { Locale } from "./config";

type Messages = Record<string, unknown>;

function merge(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = out[key];
    out[key] =
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      current &&
      typeof current === "object"
        ? merge(current as Messages, value as Messages)
        : value;
  }
  return out;
}

// English only covers what visitors of a public card see; anything else falls
// back to Turkish, so a missing key never renders as a raw id.
const EN = merge(tr as Messages, en as Messages);

export function messagesFor(locale: Locale): Messages {
  return locale === "en" ? EN : (tr as Messages);
}

/**
 * Public cards open in English for visitors whose browser does not prefer
 * Turkish. The owner's dashboard stays Turkish.
 */
export function cardLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) return "tr";
  const first = header.split(",")[0]?.trim().toLowerCase() ?? "";
  return first === "" || first.startsWith("tr") ? "tr" : "en";
}
