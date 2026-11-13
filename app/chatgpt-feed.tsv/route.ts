import { MARKETING_ORIGIN } from "@/lib/hosts";
import {
  GOOGLE_PRODUCT_CATEGORY,
  cleanFeedCell,
  feedImage,
  feedItemId,
  feedPrice,
} from "@/lib/marketing/feed";
import { productDescription, productUrl } from "@/lib/marketing/products";
import { CARD_FINISHES, FINISHES, chargePerUnit, isDigital } from "@/lib/orders/finishes";

/**
 * ChatGPT Shopping product feed (tab-separated, UTF-8): every physical card
 * finish plus the card-less digital product. Search only; checkout stays on
 * dijivizit.com. Built from lib/orders/finishes.ts like the Merchant feed, so
 * prices never drift. The digital product is listed at what is actually
 * charged: a year up front.
 * The .tsv extension is excluded from the middleware matcher, like /llms.txt.
 */
export const dynamic = "force-static";

const COLS = [
  "item_id",
  "title",
  "description",
  "url",
  "image_url",
  "brand",
  "price",
  "availability",
  "store_country",
  "target_countries",
  "is_eligible_search",
  "is_eligible_checkout",
  "seller_name",
  "seller_url",
  "seller_privacy_policy",
  "seller_tos",
  "google_product_category",
] as const;

const DIGITAL = FINISHES.find(isDigital)!;

export function GET() {
  const rows = [...CARD_FINISHES, DIGITAL].map((f) => {
    const row: Record<(typeof COLS)[number], string> = {
      item_id: feedItemId(f),
      title: isDigital(f) ? `${f.name}, yıllık` : f.name,
      description: productDescription(f),
      url: productUrl(f),
      image_url: feedImage(f),
      brand: "Dijivizit",
      price: feedPrice(chargePerUnit(f)),
      availability: "in_stock",
      store_country: "TR",
      target_countries: "TR",
      is_eligible_search: "true",
      is_eligible_checkout: "false",
      seller_name: "Dijivizit",
      seller_url: MARKETING_ORIGIN,
      seller_privacy_policy: `${MARKETING_ORIGIN}/yasal/gizlilik`,
      seller_tos: `${MARKETING_ORIGIN}/yasal/kullanim-kosullari`,
      google_product_category: GOOGLE_PRODUCT_CATEGORY,
    };
    return COLS.map((c) => cleanFeedCell(row[c])).join("\t");
  });
  const body = [COLS.join("\t"), ...rows].join("\n") + "\n";
  return new Response(body, {
    headers: {
      "content-type": "text/tab-separated-values; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
