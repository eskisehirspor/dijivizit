/**
 * Product pages at dijivizit.com/kartvizit/<slug>, one per card finish.
 *
 * Prices and terms come from lib/orders/finishes.ts so the order form, the
 * product pages and the structured data always agree.
 */
import { MARKETING_ORIGIN } from "@/lib/hosts";
import { PRICING, formatTry, type Finish } from "@/lib/orders/finishes";

export function productUrl(finish: Finish): string {
  return `${MARKETING_ORIGIN}/kartvizit/${finish.slug}`;
}

export function productImage(finish: Finish): string {
  return `/landing/products/${finish.id}.webp`;
}

export function productDescription(finish: Finish): string {
  const base =
    finish.material === "metal"
      ? `${finish.note} Adınız, unvanınız ve logonuz lazerle kazınır; baskı olmadığı için silinmez.`
      : `${finish.note} Gerçek ahşap; her kartın damar dokusu kendine özgüdür.`;
  return `${base} Telefona dokundurunca dijital profiliniz açılır, arkadaki QR kod her telefonda çalışır. ${formatTry(finish.price)}, KDV dahil, kargo ücretsiz.`;
}

/** What every card includes, in the words the rest of the site already uses. */
export function productFeatures(finish: Finish): string[] {
  const surface =
    finish.material === "metal"
      ? "İsim, unvan ve logo metal yüzeye lazerle kazınır; silinmez, solmaz."
      : "İsim, unvan ve logo ahşaba lazerle yakılır; mürekkep yoktur, silinmez.";
  return [
    surface,
    "İçindeki NFC çip sayesinde telefona dokundurunca dijital profiliniz açılır.",
    "Arkasındaki QR kod, NFC'si olmayan telefonlarda da aynı profili açar.",
    "Uygulama gerekmez; profil tarayıcıda açılır.",
    "Bilgileriniz değiştiğinde kartı değil, profili güncellersiniz.",
  ];
}

export function pricingTerms(): string[] {
  return [
    "Fiyatlara KDV dahildir.",
    PRICING.freeShipping ? "Kargo ücretsizdir." : "",
    `${PRICING.bulkMinQuantity} ve üzeri adette %${PRICING.bulkDiscountPercent} indirim uygulanır.`,
    `Dijital profil ilk ${PRICING.profileFreeYears} yıl ücretsizdir; sonrasında aylık ${formatTry(PRICING.profileMonthlyFee)}.`,
  ].filter(Boolean);
}

/** schema.org Product with an Offer, for one finish. */
export function productJsonLd(finish: Finish) {
  return {
    "@type": "Product",
    "@id": `${productUrl(finish)}#product`,
    name: finish.name,
    description: productDescription(finish),
    image: [`${MARKETING_ORIGIN}${productImage(finish)}`],
    sku: `DV-${finish.id.toUpperCase()}`,
    brand: { "@type": "Brand", name: "Dijivizit" },
    material: finish.material === "metal" ? "Metal" : "Ahşap",
    category: "NFC kartvizit",
    offers: {
      "@type": "Offer",
      url: productUrl(finish),
      priceCurrency: "TRY",
      price: finish.price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${MARKETING_ORIGIN}/#organization` },
      ...(PRICING.freeShipping
        ? {
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "TRY" },
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "TR" },
            },
          }
        : {}),
    },
  };
}
