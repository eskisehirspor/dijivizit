import { MARKETING_ORIGIN } from "@/lib/hosts";
import {
  FEED_COLOR,
  FEED_MATERIAL,
  GOOGLE_PRODUCT_CATEGORY,
  cleanFeedCell,
  feedImage,
  feedItemId,
  feedPrice,
} from "@/lib/marketing/feed";
import { productDescription, productUrl } from "@/lib/marketing/products";
import { CARD_FINISHES } from "@/lib/orders/finishes";

/**
 * Google Merchant Center product feed (tab-separated, fetched daily) for free
 * listings. Built from the same data as the product pages, so prices never
 * drift. Physical cards only: the digital subscription needs subscription
 * attributes Merchant Center doesn't support well for free listings.
 * A .txt path keeps it outside the middleware matcher, like /llms.txt.
 */
export const dynamic = "force-static";

const COLS = [
  "id",
  "title",
  "description",
  "link",
  "image_link",
  "additional_image_link",
  "availability",
  "price",
  "condition",
  "brand",
  "identifier_exists",
  "google_product_category",
  "product_type",
  "color",
  "material",
  "shipping",
] as const;

export function GET() {
  const rows = CARD_FINISHES.map((f) => {
    const row: Record<(typeof COLS)[number], string> = {
      id: feedItemId(f),
      title: f.name,
      description: productDescription(f),
      link: productUrl(f),
      image_link: feedImage(f),
      additional_image_link: `${MARKETING_ORIGIN}/landing/products/${f.id}.webp`,
      availability: "in_stock",
      price: feedPrice(f.price),
      condition: "new",
      brand: "Dijivizit",
      identifier_exists: "no",
      google_product_category: GOOGLE_PRODUCT_CATEGORY,
      product_type: `Kartvizit > NFC kartvizit > ${FEED_MATERIAL[f.material] ?? f.material}`,
      color: FEED_COLOR[f.id] ?? "",
      material: FEED_MATERIAL[f.material] ?? "",
      shipping: "TR:::0.00 TRY",
    };
    return COLS.map((c) => cleanFeedCell(row[c])).join("\t");
  });
  const body = [COLS.join("\t"), ...rows].join("\n") + "\n";
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
