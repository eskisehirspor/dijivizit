import { MARKETING_ORIGIN } from "@/lib/hosts";
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

const COLOR: Record<string, string> = {
  black: "Siyah",
  silver: "Gümüş",
  gold: "Altın",
  wood: "Kahverengi",
  "wood-light": "Bej",
  "pvc-black": "Siyah",
};

const MATERIAL: Record<string, string> = {
  metal: "Metal",
  wood: "Ahşap",
  pvc: "PVC",
};

const clean = (s: string) => s.replace(/[\t\r\n]+/g, " ").trim();

export function GET() {
  const rows = CARD_FINISHES.map((f) => {
    const row: Record<(typeof COLS)[number], string> = {
      id: `dv-${f.id}`,
      title: f.name,
      description: productDescription(f),
      link: productUrl(f),
      image_link: `${MARKETING_ORIGIN}/shopier/${f.id}.jpg`,
      additional_image_link: `${MARKETING_ORIGIN}/landing/products/${f.id}.webp`,
      availability: "in_stock",
      price: `${f.price.toFixed(2)} TRY`,
      condition: "new",
      brand: "Dijivizit",
      identifier_exists: "no",
      // Google taxonomy 922 = Office Supplies (no business-card leaf).
      google_product_category: "922",
      product_type: `Kartvizit > NFC kartvizit > ${MATERIAL[f.material] ?? f.material}`,
      color: COLOR[f.id] ?? "",
      material: MATERIAL[f.material] ?? "",
      shipping: "TR:::0.00 TRY",
    };
    return COLS.map((c) => clean(row[c])).join("\t");
  });
  const body = [COLS.join("\t"), ...rows].join("\n") + "\n";
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
