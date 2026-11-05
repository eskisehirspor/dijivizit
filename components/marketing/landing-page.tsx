import type { Metadata } from "next";
import Link from "next/link";

import { MARKETING_ORIGIN } from "@/lib/hosts";
import { GUIDES } from "@/lib/marketing/guides";
import { LANDINGS, type Landing } from "@/lib/marketing/landings";
import { SEGMENTS } from "@/lib/marketing/segments";
import { TOOLS } from "@/lib/marketing/tools";
import { pricingTerms, productImage, productJsonLd, productUrl } from "@/lib/marketing/products";
import { PromiseStrip, WhyDijivizit } from "@/components/marketing/why-dijivizit";
import { CARD_FINISHES, FINISHES, formatPrice, formatTry } from "@/lib/orders/finishes";

export function landingMetadata(l: Landing): Metadata {
  const url = `/${l.slug}`;
  return {
    title: { absolute: l.title },
    description: l.description,
    alternates: { canonical: url },
    openGraph: { title: l.title, description: l.description, url },
    twitter: { title: l.title, description: l.description },
  };
}

/** A category page: product grid with prices, explanatory sections, comparison, FAQ. */
export function LandingPage({ landing: l }: { landing: Landing }) {
  const url = `${MARKETING_ORIGIN}/${l.slug}`;
  const guides = l.guides
    .map((slug) => GUIDES.find((g) => g.slug === slug))
    .filter((g): g is (typeof GUIDES)[number] => Boolean(g));
  const siblings = l.siblings
    .map((slug) => [...LANDINGS, ...SEGMENTS].find((x) => x.slug === slug))
    .filter((x): x is Landing => Boolean(x));
  const children = SEGMENTS.filter((x) => x.parent?.href === `/${l.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        url,
        name: l.h1,
        description: l.description,
        inLanguage: "tr-TR",
        isPartOf: { "@id": `${MARKETING_ORIGIN}/#website` },
        about: l.term,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: FINISHES.map((f, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: productUrl(f),
            item: productJsonLd(f),
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Dijivizit", item: `${MARKETING_ORIGIN}/` },
          ...(l.parent
            ? [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: l.parent.name,
                  item: `${MARKETING_ORIGIN}${l.parent.href}`,
                },
              ]
            : []),
          { "@type": "ListItem", position: l.parent ? 3 : 2, name: l.term, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: l.faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };

  const minPrice = Math.min(...CARD_FINISHES.map((f) => f.price));
  const digital = FINISHES.find((f) => f.material === "digital")!;

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
        {l.parent ? (
          <>
            <Link href={l.parent.href} className="hover:text-foreground">
              {l.parent.name}
            </Link>
            {" / "}
          </>
        ) : null}
        <span>{l.term}</span>
      </nav>

      <header className="flex max-w-3xl flex-col gap-5">
        <h1 className="text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-7xl">
          {l.h1}
        </h1>
        <p className="text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
          {l.lead}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/siparis"
            className="inline-flex h-12 items-center rounded-full bg-neutral-950 px-7 text-base font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Sipariş ver
          </Link>
          <Link
            href="/kartvizit"
            className="inline-flex h-12 items-center rounded-full border border-border px-7 text-base font-medium transition-colors hover:bg-muted"
          >
            Fiyatlar
          </Link>
          <span className="text-sm text-muted-foreground">
            Kartlar {formatTry(minPrice)}’den başlar · kartsız dijital kartvizit{" "}
            {formatPrice(digital)} · KDV dahil
          </span>
        </div>
        <PromiseStrip className="pt-4" />
      </header>

      <section aria-labelledby="modeller" className="mt-16">
        <h2 id="modeller" className="sr-only">
          {l.term} modelleri
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5 lg:grid-cols-7">
          {FINISHES.map((f) => (
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
                <span className="text-sm font-medium group-hover:underline">{f.name}</span>
                <span className="text-sm text-muted-foreground">{formatPrice(f)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <WhyDijivizit className="mt-24 border-t border-border/60 pt-16" />

      <div className="mt-20 grid gap-x-16 gap-y-14 border-t border-border/60 pt-16 lg:grid-cols-2">
        {l.sections.map((s) => (
          <section key={s.heading} className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-balance">{s.heading}</h2>
            {s.paragraphs?.map((p) => (
              <p key={p.slice(0, 40)} className="leading-relaxed text-pretty text-foreground/85">
                {p}
              </p>
            ))}
            {s.list ? (
              <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-foreground/85">
                {s.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      {l.compare ? (
        <section className="mt-20 flex flex-col gap-6 border-t border-border/60 pt-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Kâğıt kartvizit ile karşılaştırma
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th scope="col" className="py-3 pr-6 font-medium">
                    <span className="sr-only">Özellik</span>
                  </th>
                  <th scope="col" className="py-3 pr-6 font-medium">
                    Kâğıt kartvizit
                  </th>
                  <th scope="col" className="py-3 font-medium text-foreground">
                    Dijivizit {l.term.toLocaleLowerCase("tr-TR")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {l.compare.map(([k, a, b]) => (
                  <tr key={k} className="border-b border-border/60">
                    <th scope="row" className="py-4 pr-6 font-medium">
                      {k}
                    </th>
                    <td className="py-4 pr-6 text-muted-foreground">{a}</td>
                    <td className="py-4">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="mt-20 grid gap-12 border-t border-border/60 pt-16 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">Sık sorulanlar</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {pricingTerms().map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="divide-y divide-border/60 border-y border-border/60">
          {l.faq.map(({ q, a }) => (
            <details key={q} className="group py-2">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                <h3>{q}</h3>
                <span
                  aria-hidden="true"
                  className="text-2xl leading-none font-light text-muted-foreground transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 leading-relaxed text-pretty text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {children.length > 0 ? (
        <section className="mt-20 grid gap-10 border-t border-border/60 pt-16 sm:grid-cols-2">
          {(
            [
              ["meslek", "Mesleğinize göre dijital kartvizit"],
              ["sehir", "Şehrinize göre dijital kartvizit"],
            ] as const
          ).map(([kind, title]) => (
            <div key={kind} className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
              <ul className="flex flex-wrap gap-2">
                {children
                  .filter((c) => c.kind === kind)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/${c.slug}`}
                        className="inline-flex h-9 items-center rounded-full border border-border px-4 text-sm transition-colors hover:bg-muted"
                      >
                        {c.term}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}

      <section className="mt-20 grid gap-10 border-t border-border/60 pt-16 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Rehberden</h2>
          <ul className="flex flex-col gap-2">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={`/rehber/${g.slug}`} className="underline-offset-4 hover:underline">
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Ayrıca bakın</h2>
          <ul className="flex flex-col gap-2">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`} className="underline-offset-4 hover:underline">
                  {s.term}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/kartvizit" className="underline-offset-4 hover:underline">
                NFC kartvizit fiyatları
              </Link>
            </li>
            {TOOLS.map((t) => (
              <li key={t.slug}>
                <Link href={`/${t.slug}`} className="underline-offset-4 hover:underline">
                  {t.term} (ücretsiz)
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
