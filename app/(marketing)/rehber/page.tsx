import type { Metadata } from "next";
import Link from "next/link";

import { MARKETING_ORIGIN } from "@/lib/hosts";
import { GUIDES } from "@/lib/marketing/guides";

const TITLE = "NFC Kartvizit Rehberi | Dijivizit";
const DESCRIPTION =
  "NFC kartvizit, metal, ahşap ve PVC kartvizit, dijital kartvizit oluşturma ve telefon uyumluluğu hakkında kısa, net rehberler.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/rehber" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/rehber" },
};

export default function GuidesPage() {
  // Newest first, so fresh guides get the most prominent internal links.
  const guides = [...GUIDES].sort((a, b) =>
    (b.updated ?? b.published).localeCompare(a.updated ?? a.published),
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: `${MARKETING_ORIGIN}/rehber`,
    inLanguage: "tr-TR",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: guides.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${MARKETING_ORIGIN}/rehber/${g.slug}`,
        name: g.title,
      })),
    },
  };
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-32 pb-28 sm:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="mb-14 flex max-w-2xl flex-col gap-4">
        <p className="text-sm font-medium tracking-wide text-muted-foreground">Rehber</p>
        <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
          Akıllı kartvizit hakkında bilmeniz gerekenler
        </h1>
        <p className="text-lg text-muted-foreground">{DESCRIPTION}</p>
      </div>
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link href={`/rehber/${g.slug}`} className="group flex flex-col gap-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element -- static stills; no image optimizer on Workers */}
                <img
                  src={g.image}
                  alt={g.imageAlt}
                  width={1080}
                  height={1350}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-xl font-semibold tracking-tight group-hover:underline">
                  {g.title}
                </h2>
                <p className="text-sm text-muted-foreground">{g.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
