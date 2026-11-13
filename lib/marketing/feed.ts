/** Shared helpers for the product feeds (Google Merchant, ChatGPT Shopping). */
import { MARKETING_ORIGIN } from "@/lib/hosts";
import type { Finish } from "@/lib/orders/finishes";

export const FEED_COLOR: Record<string, string> = {
  black: "Siyah",
  silver: "Gümüş",
  gold: "Altın",
  wood: "Kahverengi",
  "wood-light": "Bej",
  "pvc-black": "Siyah",
};

export const FEED_MATERIAL: Record<string, string> = {
  metal: "Metal",
  wood: "Ahşap",
  pvc: "PVC",
};

/** Google taxonomy 922 = Office Supplies (no business-card leaf). */
export const GOOGLE_PRODUCT_CATEGORY = "922";

/** Tabs and newlines would break a TSV row. */
export const cleanFeedCell = (s: string) => s.replace(/[\t\r\n]+/g, " ").trim();

/** "2500.00 TRY" */
export const feedPrice = (amount: number) => `${amount.toFixed(2)} TRY`;

export const feedItemId = (finish: Finish) => `dv-${finish.id}`;

export const feedImage = (finish: Finish) => `${MARKETING_ORIGIN}/shopier/${finish.id}.jpg`;
