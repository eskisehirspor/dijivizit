import type { FinishId } from "@/lib/orders/finishes";

/**
 * Shopier product pages for each Dijivizit product, written after the
 * shopier-setup workflow lists them (ids also live in integration_tokens).
 * A finish without a URL falls back to the request form.
 */
export const SHOPIER_PRODUCT_URLS: Partial<Record<FinishId, string>> = {
  black: "https://www.shopier.com/dijivizitcom/52522511",
  silver: "https://www.shopier.com/dijivizitcom/52522526",
  gold: "https://www.shopier.com/dijivizitcom/52522545",
  wood: "https://www.shopier.com/dijivizitcom/52522552",
  "wood-light": "https://www.shopier.com/dijivizitcom/52522592",
  digital: "https://www.shopier.com/dijivizitcom/52522609",
};

export function shopierUrl(finish: FinishId): string | null {
  return SHOPIER_PRODUCT_URLS[finish] ?? null;
}
