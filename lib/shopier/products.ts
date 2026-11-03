import type { FinishId } from "@/lib/orders/finishes";

/**
 * Shopier product pages for each Dijivizit product, written after the
 * shopier-setup workflow lists them (ids also live in integration_tokens).
 * A finish without a URL falls back to the request form.
 */
export const SHOPIER_PRODUCT_URLS: Partial<Record<FinishId, string>> = {};

export function shopierUrl(finish: FinishId): string | null {
  return SHOPIER_PRODUCT_URLS[finish] ?? null;
}
