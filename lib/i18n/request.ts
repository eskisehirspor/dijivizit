import { getRequestConfig } from "next-intl/server";

import messages from "@/messages/tr.json";

import { DEFAULT_LOCALE } from "./config";

// A static import is used while there is exactly one locale. Adding a second
// one means swapping this for a dynamic import keyed by the resolved locale.
export default getRequestConfig(async () => ({
  locale: DEFAULT_LOCALE,
  messages,
}));
