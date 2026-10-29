import type { Metadata } from "next";
import Link from "next/link";

import { MARKETING_ORIGIN } from "@/lib/hosts";
import { pricingTerms, productImage, productJsonLd, productUrl } from "@/lib/marketing/products";
import { FINISHES, PRICING, formatTry } from "@/lib/orders/finishes";

const metalPrice = FINISHES.find((f) => f.material === "metal")!.price;
const woodPrice = FINISHES.find((f) => f.material === "wood")!.price;

const TITLE = "NFC Kartvizit Fiyatları: Metal ve Ahşap Akıllı Kartvizit | Dijivizit";
const DESCRIPTION = `Metal NFC kartvizit ${formatTry(metalPrice)}, ahşap NFC kartvizit ${formatTry(woodPrice)}. KDV dahil, kargo ücretsiz, ${PRICING.bulkMinQuantity} ve üzeri adette %${PRICING.bulkDiscountPercent} indirim. Siyah, gold, gümüş, koyu ve açık ahşap.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/kartvizit" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/kartvizit" },
};

export default function ProductsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Dijivizit NFC kartvizitler",
        itemListElement: FINISHES.map((f, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: productUrl(f),
          item: productJsonLd(f),
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Dijivizit", item: `${MARKETING_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Kartvizitler", item: `${MARKETING_ORIGIN}/kartvizit` },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-32 pb-28 sm:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="mb-14 flex max-w-2xl flex-col gap-4">
        <p className="text-sm font-medium tracking-wide text-muted-foreground">Kartvizitler</p>
        <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
          NFC kartvizit fiyatları
        </h1>
        <p className="text-lg text-muted-foreground">
          Metal ya da ahşap, beş kaplama. Her kartta NFC çip, arkasında QR kod ve dijital profil.
        </p>
      </div>

      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {FINISHES.map((f) => (
          <li key={f.id}>
            <Link href={`/kartvizit/${f.slug}`} className="group flex flex-col gap-4">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#d9d6d1]">
                {/* eslint-disable-next-line @next/next/no-img-element -- static stills; no image optimizer on Workers */}
                <img
                  src={productImage(f)}
                  alt={f.name}
                  width={2560}
                  height={1440}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-xl font-semibold tracking-tight group-hover:underline">{f.name}</h2>
                <p className="text-lg font-medium">{formatTry(f.price)}</p>
                <p className="text-sm text-muted-foreground">{f.note}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-20 flex max-w-2xl flex-col gap-4 border-t border-border/60 pt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Fiyat ve koşullar</h2>
        <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-foreground/85">
          {pricingTerms().map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
