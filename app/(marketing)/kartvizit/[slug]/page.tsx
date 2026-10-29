import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MARKETING_ORIGIN } from "@/lib/hosts";
import {
  pricingTerms,
  productDescription,
  productFeatures,
  productImage,
  productJsonLd,
  productUrl,
} from "@/lib/marketing/products";
import { FINISHES, PRICING, formatTry, getFinishBySlug, unitPrice } from "@/lib/orders/finishes";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return FINISHES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const finish = getFinishBySlug((await params).slug);
  if (!finish) return {};
  const url = `/kartvizit/${finish.slug}`;
  const title = `${finish.name} | ${formatTry(finish.price)} | Dijivizit`;
  const description = productDescription(finish);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: productImage(finish), width: 2560, height: 1440, alt: finish.name }],
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
          { "@type": "ListItem", position: 2, name: "Kartvizitler", item: `${MARKETING_ORIGIN}/kartvizit` },
          { "@type": "ListItem", position: 3, name: finish.name, item: productUrl(finish) },
        ],
      },
    ],
  };
  const others = FINISHES.filter((f) => f.id !== finish.id);
  const bulkPrice = unitPrice(finish, PRICING.bulkMinQuantity);

  return (
    <article className="mx-auto w-full max-w-6xl px-6 pt-32 pb-28 sm:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <nav aria-label="Konum" className="mb-8 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Dijivizit
        </Link>
        {" / "}
        <Link href="/kartvizit" className="hover:text-foreground">
          Kartvizitler
        </Link>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-[#d9d6d1]">
          {/* eslint-disable-next-line @next/next/no-img-element -- static stills; no image optimizer on Workers */}
          <img
            src={productImage(finish)}
            alt={`${finish.name}, ${finish.note}`}
            width={2560}
            height={1440}
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
            {formatTry(finish.price)}{" "}
            <span className="text-base font-normal text-muted-foreground">KDV dahil</span>
          </p>
          <p className="text-muted-foreground">
            {PRICING.bulkMinQuantity} ve üzeri adette tanesi {formatTry(bulkPrice)} (%
            {PRICING.bulkDiscountPercent} indirim). Kargo ücretsiz.
          </p>
          <p className="leading-relaxed text-foreground/85">{finish.note}</p>
          <Link
            href={`/siparis?kaplama=${finish.id}`}
            className="inline-flex h-12 w-fit items-center rounded-full bg-neutral-950 px-8 text-base font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Sipariş talebi oluştur
          </Link>
          <p className="text-sm text-muted-foreground">
            Talebini aldıktan sonra seni arayıp kart tasarımını birlikte netleştiririz.
          </p>
        </div>
      </div>

      <div className="mt-20 grid gap-12 lg:grid-cols-2">
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Kartta neler var?</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-foreground/85">
            {productFeatures(finish).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Fiyat ve koşullar</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-foreground/85">
            {pricingTerms().map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-20 flex flex-col gap-6 border-t border-border/60 pt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Diğer kaplamalar</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((f) => (
            <li key={f.id}>
              <Link href={`/kartvizit/${f.slug}`} className="group flex flex-col gap-3">
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
                <span className="font-medium group-hover:underline">{f.name}</span>
                <span className="text-sm text-muted-foreground">{formatTry(f.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
