import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MARKETING_ORIGIN } from "@/lib/hosts";
import {
  pricingTerms,
  productMetaDescription,
  productFeatures,
  productImage,
  productJsonLd,
  productUrl,
} from "@/lib/marketing/products";
import { BuyButton } from "@/components/marketing/buy-button";
import { TrackViewItem } from "@/components/marketing/track-view-item";
import { shopierUrl } from "@/lib/shopier/products";
import { WhyDijivizit } from "@/components/marketing/why-dijivizit";
import {
  FINISHES,
  PRICING,
  PROMISES,
  analyticsItem,
  chargePerUnit,
  formatPrice,
  formatTry,
  getFinishBySlug,
  isDigital,
  unitPrice,
} from "@/lib/orders/finishes";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return FINISHES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const finish = getFinishBySlug((await params).slug);
  if (!finish) return {};
  const url = `/kartvizit/${finish.slug}`;
  const title = `${finish.name} | ${formatPrice(finish)} | Dijivizit`;
  const description = productMetaDescription(finish);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: productImage(finish), width: 1600, height: 2000, alt: finish.name }],
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const finish = getFinishBySlug((await params).slug);
  if (!finish) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      productJsonLd(finish),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Dijivizit", item: `${MARKETING_ORIGIN}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Kartvizitler",
            item: `${MARKETING_ORIGIN}/kartvizit`,
          },
          { "@type": "ListItem", position: 3, name: finish.name, item: productUrl(finish) },
        ],
      },
    ],
  };
  const others = FINISHES.filter((f) => f.id !== finish.id);
  const bulkPrice = unitPrice(finish, PRICING.bulkMinQuantity);
  const digital = isDigital(finish);
  const buyUrl = shopierUrl(finish.id);

  return (
    <article className="mx-auto w-full max-w-6xl px-6 pt-32 pb-28 sm:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <TrackViewItem {...analyticsItem(finish)} />
      <nav aria-label="Konum" className="mb-8 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Dijivizit
        </Link>
        {" / "}
        <Link href="/kartvizit" className="hover:text-foreground">
          Kartvizitler
        </Link>
      </nav>

      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#d9d6d1]">
          {/* eslint-disable-next-line @next/next/no-img-element -- static stills; no image optimizer on Workers */}
          <img
            src={productImage(finish)}
            alt={`${finish.name}, ${finish.note}`}
            width={1600}
            height={2000}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
            {finish.name}
          </h1>
          <p className="text-3xl font-semibold tracking-tight">
            {formatPrice(finish)}{" "}
            <span className="text-base font-normal text-muted-foreground">KDV dahil</span>
          </p>
          <p className="text-muted-foreground">
            {PRICING.bulkMinQuantity} ve üzeri{" "}
            {digital ? "kişilik ekipte kişi başı" : "adette tanesi"}{" "}
            {formatPrice(finish, bulkPrice)} (%{PRICING.bulkDiscountPercent} indirim).{" "}
            {digital
              ? `Ödeme yıllık ${formatTry(PRICING.digitalYearlyFee)} olarak peşin alınır. Kart yok, kargo yok; hemen teslim: link ve QR kodunuz ${PROMISES.digitalDeliveryHours} saat içinde e-postanızda.`
              : `Kargo ücretsiz, ${PROMISES.deliveryHours} saatte teslim. Kart okunmazsa ücretsiz değişim.`}
          </p>
          <p className="leading-relaxed text-foreground/85">{finish.note}</p>
          {buyUrl ? (
            <div className="flex flex-col gap-3">
              <BuyButton
                href={buyUrl}
                item={analyticsItem(finish)}
                label={`Satın al · ${formatTry(chargePerUnit(finish))}${digital ? "/yıl" : ""}`}
              />
              <p className="text-sm text-muted-foreground">
                Güvenli kartla ödeme Shopier üzerinden.{" "}
                <Link
                  href={`/siparis?kaplama=${finish.id}`}
                  className="text-foreground underline underline-offset-4"
                >
                  10 ve üzeri adet ya da kurumsal talep
                </Link>
              </p>
            </div>
          ) : (
            <>
              <Link
                href={`/siparis?kaplama=${finish.id}`}
                className="inline-flex h-12 w-fit items-center rounded-full bg-neutral-950 px-8 text-base font-medium text-white transition-colors hover:bg-neutral-800"
              >
                Sipariş talebi oluştur
              </Link>
              <p className="text-sm text-muted-foreground">
                Talebini aldıktan sonra seni arayıp {digital ? "profilini" : "kart tasarımını"}{" "}
                birlikte netleştiririz.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-20 grid gap-12 lg:grid-cols-2">
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            {digital ? "Neler dahil?" : "Kartta neler var?"}
          </h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-foreground/85">
            {productFeatures(finish).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Fiyat ve koşullar</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-foreground/85">
            {pricingTerms(finish).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-20 flex flex-col gap-6 border-t border-border/60 pt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Diğer ürünler</h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {others.map((f) => (
            <li key={f.id}>
              <Link href={`/kartvizit/${f.slug}`} className="group flex flex-col gap-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#d9d6d1]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static stills; no image optimizer on Workers */}
                  <img
                    src={productImage(f)}
                    alt={f.name}
                    width={1600}
                    height={2000}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <span className="font-medium group-hover:underline">{f.name}</span>
                <span className="text-sm text-muted-foreground">{formatPrice(f)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <WhyDijivizit className="mt-20 border-t border-border/60 pt-16" />
    </article>
  );
}
