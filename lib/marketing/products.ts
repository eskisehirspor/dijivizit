/**
 * Product pages at dijivizit.com/kartvizit/<slug>, one per card finish.
 *
 * Prices and terms come from lib/orders/finishes.ts so the order form, the
 * product pages and the structured data always agree.
 */
import { MARKETING_ORIGIN } from "@/lib/hosts";
import {
  FINISHES,
  PRICING,
  PROMISES,
  formatPrice,
  formatTry,
  isDigital,
  type Finish,
} from "@/lib/orders/finishes";

const DIGITAL = FINISHES.find((f) => f.material === "digital")!;

export function productUrl(finish: Finish): string {
  return `${MARKETING_ORIGIN}/kartvizit/${finish.slug}`;
}

export function productImage(finish: Finish): string {
  return `/landing/products/${finish.id}.webp`;
}

export function productDescription(finish: Finish): string {
  if (isDigital(finish)) {
    return `Kartsız dijital kartvizit: profil linkiniz ve QR kodunuz. Mesajla, e-posta imzasında ya da sosyal medyada paylaşın; QR kodu sunumlara, broşürlere, vitrine koyun. Rehbere kayıt, bilgi bırakma formu ve analitik dahil. Aylık ${formatTry(finish.price)}, yıllık ${formatTry(PRICING.digitalYearlyFee)} olarak peşin ödenir, KDV dahil.`;
  }
  const base =
    finish.material === "metal"
      ? `${finish.note} Adınız, unvanınız ve logonuz lazerle kazınır; baskı olmadığı için silinmez.`
      : `${finish.note} Gerçek ahşap; her kartın damar dokusu kendine özgüdür.`;
  return `${base} Telefona dokundurunca dijital profiliniz açılır, arkadaki QR kod her telefonda çalışır. ${formatTry(finish.price)}, KDV dahil, kargo ücretsiz.`;
}

/** What every card includes, in the words the rest of the site already uses. */
export function productFeatures(finish: Finish): string[] {
  if (isDigital(finish)) {
    return [
      "Size özel profil linki ve yüksek çözünürlüklü QR kod.",
      "Profil adresi isminizi değil rastgele bir kodu içerir; linkiniz tahmin edilemez.",
      "Karşı taraf tek dokunuşla rehberine kaydeder; uygulama gerekmez.",
      'Ziyaretçi "Bilgilerimi bırak" ile kendi bilgisini size iletir.',
      "Kaç kez açıldığını, hangi şehir ve cihazlardan görüntülendiğini görürsünüz.",
      "İstediğiniz zaman NFC karta geçebilirsiniz; link ve QR aynı kalır.",
    ];
  }
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

export function pricingTerms(finish?: Finish): string[] {
  if (finish && isDigital(finish)) {
    return [
      "Fiyata KDV dahildir.",
      `Aylık ${formatTry(finish.price)}; ödeme yıllık ${formatTry(PRICING.digitalYearlyFee)} olarak tek seferde alınır.`,
      "Kart, kargo ya da kurulum ücreti yoktur.",
      `${PRICING.bulkMinQuantity} ve üzeri kişilik ekiplerde %${PRICING.bulkDiscountPercent} indirim uygulanır.`,
      `Hemen teslim: link ve QR kodunuz ${PROMISES.digitalDeliveryHours} saat içinde e-postanızda.`,
    ];
  }
  return [
    "Fiyatlara KDV dahildir.",
    PRICING.freeShipping ? "Kargo ücretsizdir." : "",
    `${PROMISES.deliveryHours} saatte teslim.`,
    "Kart okunmazsa ücretsiz yenisiyle değiştirilir.",
    `${PRICING.bulkMinQuantity} ve üzeri adette %${PRICING.bulkDiscountPercent} indirim uygulanır.`,
    `Dijital profil ilk ${PRICING.profileFreeYears} yıl ücretsizdir; sonrasında aylık ${formatTry(PRICING.profileMonthlyFee)}.`,
    `Kart istemeyenlere kartsız dijital kartvizit: ${formatPrice(DIGITAL)}.`,
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
    ...(isDigital(finish) ? {} : { material: finish.material === "metal" ? "Metal" : "Ahşap" }),
    category: isDigital(finish) ? "Dijital kartvizit" : "NFC kartvizit",
    offers: {
      "@type": "Offer",
      url: productUrl(finish),
      priceCurrency: "TRY",
      price: (isDigital(finish) ? PRICING.digitalYearlyFee : finish.price).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${MARKETING_ORIGIN}/#organization` },
      ...(isDigital(finish)
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: PRICING.digitalYearlyFee.toFixed(2),
              priceCurrency: "TRY",
              billingDuration: "P1Y",
              unitText: "yıl",
            },
          }
        : PRICING.freeShipping
          ? {
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "TRY" },
                shippingDestination: { "@type": "DefinedRegion", addressCountry: "TR" },
                deliveryTime: {
                  "@type": "ShippingDeliveryTime",
                  handlingTime: {
                    "@type": "QuantitativeValue",
                    minValue: 0,
                    maxValue: 1,
                    unitCode: "DAY",
                  },
                  transitTime: {
                    "@type": "QuantitativeValue",
                    minValue: 1,
                    maxValue: 2,
                    unitCode: "DAY",
                  },
                },
              },
            }
          : {}),
    },
  };
}
