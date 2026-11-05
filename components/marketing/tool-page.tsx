import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { CardBuilder } from "@/components/marketing/card-builder";
import { MARKETING_ORIGIN } from "@/lib/hosts";
import { GUIDES } from "@/lib/marketing/guides";
import { LANDINGS } from "@/lib/marketing/landings";
import { TOOLS, type Tool } from "@/lib/marketing/tools";

export function toolMetadata(t: Tool): Metadata {
  const url = `/${t.slug}`;
  return {
    title: { absolute: t.title },
    description: t.description,
    alternates: { canonical: url },
    openGraph: { title: t.title, description: t.description, url },
    twitter: { title: t.title, description: t.description },
  };
}

/**
 * A free tool page: the tool itself, how-to sections, FAQ and related links.
 * `children` is the interactive tool; without it the vCard QR builder is shown.
 */
export function ToolPage({ tool: t, children }: { tool: Tool; children?: ReactNode }) {
  const url = `${MARKETING_ORIGIN}/${t.slug}`;
  const guides = t.guides
    .map((slug) => GUIDES.find((g) => g.slug === slug))
    .filter((g): g is (typeof GUIDES)[number] => Boolean(g));
  const otherTools = TOOLS.filter((x) => x.slug !== t.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: t.h1,
        url,
        description: t.description,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage: "tr-TR",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
        provider: { "@id": `${MARKETING_ORIGIN}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Dijivizit", item: `${MARKETING_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: t.term, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: t.faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };

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
        <span>{t.term}</span>
      </nav>

      <header className="mb-12 flex max-w-3xl flex-col gap-5">
        <p className="text-sm font-medium tracking-wide text-muted-foreground">
          Ücretsiz araç · üyelik gerekmez
        </p>
        <h1 className="text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-7xl">
          {t.h1}
        </h1>
        <p className="text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
          {t.lead}
        </p>
      </header>

      {children ?? <CardBuilder tool={t.slug} />}

      <div className="mt-24 grid gap-x-16 gap-y-14 border-t border-border/60 pt-16 lg:grid-cols-2">
        {t.sections.map((s) => (
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

      <section className="mt-20 grid gap-12 border-t border-border/60 pt-16 lg:grid-cols-[1fr_1.4fr]">
        <h2 className="text-3xl font-semibold tracking-tight text-balance">Sık sorulanlar</h2>
        <div className="divide-y divide-border/60 border-y border-border/60">
          {t.faq.map(({ q, a }) => (
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
            {otherTools.map((x) => (
              <li key={x.slug}>
                <Link href={`/${x.slug}`} className="underline-offset-4 hover:underline">
                  {x.term}
                </Link>
              </li>
            ))}
            {LANDINGS.map((l) => (
              <li key={l.slug}>
                <Link href={`/${l.slug}`} className="underline-offset-4 hover:underline">
                  {l.term}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/kartvizit/dijital-kartvizit-qr"
                className="underline-offset-4 hover:underline"
              >
                Kartsız dijital kartvizit (link + QR)
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
}
