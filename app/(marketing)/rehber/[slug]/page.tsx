import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MARKETING_ORIGIN } from "@/lib/hosts";
import { GUIDES, getGuide } from "@/lib/marketing/guides";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return {};
  const url = `/rehber/${guide.slug}`;
  return {
    title: { absolute: `${guide.title} | Dijivizit` },
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      url,
      images: [{ url: guide.image, width: 1080, height: 1350, alt: guide.imageAlt }],
    },
  };
}

export default async function GuidePage({ params }: Params) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();

  const url = `${MARKETING_ORIGIN}/rehber/${guide.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        image: `${MARKETING_ORIGIN}${guide.image}`,
        datePublished: guide.published,
        dateModified: guide.published,
        inLanguage: "tr-TR",
        mainEntityOfPage: url,
        author: { "@id": `${MARKETING_ORIGIN}/#organization` },
        publisher: { "@id": `${MARKETING_ORIGIN}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Dijivizit", item: `${MARKETING_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Rehber", item: `${MARKETING_ORIGIN}/rehber` },
          { "@type": "ListItem", position: 3, name: guide.label, item: url },
        ],
      },
      ...(guide.faq
        ? [
            {
              "@type": "FAQPage",
              mainEntity: guide.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };
  const others = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);

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
        <Link href="/rehber" className="hover:text-foreground">
          Rehber
        </Link>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <div className="flex max-w-2xl flex-col gap-10">
          <header className="flex flex-col gap-5">
            <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
              {guide.title}
            </h1>
            <p className="text-lg text-muted-foreground">{guide.description}</p>
          </header>

          {guide.sections.map((s) => (
            <section key={s.heading} className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold tracking-tight">{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p} className="leading-relaxed text-foreground/85">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-foreground/85">
                  {s.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {s.link && (
                <p>
                  <a
                    href={s.link.href}
                    className="font-medium underline underline-offset-4 hover:text-foreground"
                    {...(s.link.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                  >
                    {s.link.label}
                  </a>
                </p>
              )}
            </section>
          ))}

          {guide.faq && (
            <section className="flex flex-col gap-5">
              <h2 className="text-2xl font-semibold tracking-tight">Sık sorulanlar</h2>
              {guide.faq.map((f) => (
                <div key={f.q} className="flex flex-col gap-1.5">
                  <h3 className="font-semibold">{f.q}</h3>
                  <p className="leading-relaxed text-foreground/85">{f.a}</p>
                </div>
              ))}
            </section>
          )}

          <div className="flex flex-col items-start gap-4 rounded-2xl border border-border/60 p-8">
            <p className="text-xl font-semibold tracking-tight">
              Kartınızı seçin, gerisini biz halledelim.
            </p>
            <p className="text-muted-foreground">
              Kaplamanızı seçip talep bırakın; ekibimiz sizi arayarak tüm detayları netleştirsin.
            </p>
            <Link
              href="/siparis"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              Talep oluştur
            </Link>
          </div>
        </div>

        <aside className="flex flex-col gap-10">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element -- static stills; no image optimizer on Workers */}
            <img
              src={guide.image}
              alt={guide.imageAlt}
              width={1080}
              height={1350}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium tracking-wide text-muted-foreground">
              Diğer rehberler
            </p>
            {others.map((g) => (
              <Link key={g.slug} href={`/rehber/${g.slug}`} className="font-medium hover:underline">
                {g.title}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </article>
  );
}
