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

/**
 * Product page photos: the studio render of the front (the cover), then the
 * back, then real photos of the card in hand (the finish and print composited
 * onto the supplier's blank card), all 1600x2000.
 */
// One in-hand photo per card (the straight-on shot reads best).
const HAND_PHOTOS: Partial<Record<Finish["id"], number>> = {
  black: 1,
  silver: 1,
  gold: 1,
  wood: 1,
  "wood-light": 1,
  "pvc-black": 1,
};

export function productGallery(finish: Finish): { src: string; alt: string }[] {
  if (isDigital(finish)) return [{ src: productImage(finish), alt: finish.name }];
  const n = HAND_PHOTOS[finish.id] ?? 0;
  return [
    { src: productImage(finish), alt: `${finish.name}, ön yüz: logo ve NFC işareti` },
    { src: `/landing/products/${finish.id}-arka.webp`, alt: `${finish.name}, arka yüz` },
    ...Array.from({ length: n }, (_, i) => ({
      src: `/landing/products/${finish.id}/el-${i + 1}.webp`,
      alt: `${finish.name}, elde`,
    })),
  ];
}

/** Short version for the meta description (Google shows ~155 characters). */
export function productMetaDescription(finish: Finish): string {
  if (isDigital(finish)) {
    return `Kartsız dijital kartvizit: profil linki ve QR kod, 2 saatte e-postanızda. Rehbere kayıt, bilgi bırakma formu ve analitik. Aylık ${formatTry(finish.price)}, KDV dahil.`;
  }
  return `${finish.name}: telefona dokundur, dijital profilin açılsın; link ve QR kod da sizde. ${formatTry(finish.price)}, KDV dahil, kargo ücretsiz, 72 saatte teslim.`;
}

export function productDescription(finish: Finish): string {
  if (isDigital(finish)) {
    return `Kartsız dijital kartvizit: profil linkiniz ve QR kodunuz. Mesajla, e-posta imzasında ya da sosyal medyada paylaşın; QR kodu sunumlara, broşürlere, vitrine koyun. Rehbere kayıt, bilgi bırakma formu ve analitik dahil. Aylık ${formatTry(finish.price)}, yıllık ${formatTry(PRICING.digitalYearlyFee)} olarak peşin ödenir, KDV dahil.`;
  }
  const base =
    finish.material === "metal"
      ? `${finish.note} Logo ve temassız işareti lazerle kazınır; baskı olmadığı için silinmez.`
      : finish.material === "pvc"
        ? `${finish.note} Hafif ve ince; logo ve temassız işareti mat yüzeye işlenir.`
        : `${finish.note} Gerçek ahşap; her kartın damar dokusu kendine özgüdür.`;
  return `${base} Telefona dokundurunca dijital profiliniz açılır; NFC'si olmayan telefonlar için profil linkiniz ve QR kodunuz da hazır. ${formatTry(finish.price)}, KDV dahil, kargo ücretsiz.`;
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
      ? "Logo ve temassız işareti metal yüzeye lazerle kazınır; silinmez, solmaz."
      : finish.material === "pvc"
        ? "Mat siyah PVC yüzey; logo ve temassız işareti kartın üzerinde, sade ve şık."
        : "Logo ve temassız işareti ahşaba lazerle yakılır; mürekkep yoktur, silinmez.";
  return [
    surface,
    "İçindeki NFC çip sayesinde telefona dokundurunca dijital profiliniz açılır.",
    "NFC'si olmayan telefonlar için profil linkiniz ve QR kodunuz da hazır; ekrandan okutulur.",
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
    image: productGallery(finish).map((g) => `${MARKETING_ORIGIN}${g.src}`),
    sku: `DV-${finish.id.toUpperCase()}`,
    brand: { "@type": "Brand", name: "Dijivizit" },
    ...(isDigital(finish)
      ? {}
      : {
          material:
            finish.material === "metal" ? "Metal" : finish.material === "pvc" ? "PVC" : "Ahşap",
        }),
    category: isDigital(finish) ? "Dijital kartvizit" : "NFC kartvizit",
    offers: {
      "@type": "Offer",
      url: productUrl(finish),
      priceCurrency: "TRY",
      price: (isDigital(finish) ? PRICING.digitalYearlyFee : finish.price).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${MARKETING_ORIGIN}/#organization` },
      // See /yasal/teslimat-ve-iade: 14-day withdrawal, return shipping paid by us.
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "TR",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        ...(isDigital(finish)
          ? {}
          : {
              returnMethod: "https://schema.org/ReturnByMail",
              returnFees: "https://schema.org/FreeReturn",
            }),
        merchantReturnLink: `${MARKETING_ORIGIN}/yasal/teslimat-ve-iade`,
      },
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
