import type { Metadata } from "next";
import Link from "next/link";

import { MARKETING_ORIGIN } from "@/lib/hosts";
import { pricingTerms, productImage, productUrl } from "@/lib/marketing/products";
import { PromiseStrip, WhyDijivizit } from "@/components/marketing/why-dijivizit";
import { FINISHES, formatPrice, formatTry } from "@/lib/orders/finishes";
import { getLanding } from "@/lib/marketing/landings";

/** The NFC kartvizit explainer lives here too: Google ranks this page for the term. */
const nfc = getLanding("nfc-kartvizit");

const metalPrice = FINISHES.find((f) => f.material === "metal")!.price;
const woodPrice = FINISHES.find((f) => f.material === "wood")!.price;
const pvcPrice = FINISHES.find((f) => f.material === "pvc")!.price;

const TITLE = "NFC Kartvizit: Fiyatlar, Metal, Ahşap ve PVC (2026) | Dijivizit";
const DESCRIPTION = `NFC kartvizit fiyatları: metal ${formatTry(metalPrice)}, ahşap ${formatTry(woodPrice)}, PVC ${formatTry(pvcPrice)}, kartsız dijital aylık 59,90 TL. KDV dahil, kargo ücretsiz, 72 saatte teslim.`;

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
          name: f.name,
        })),
      },
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
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: nfc.faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
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
          Metal, ahşap ya da mat siyah PVC: altı seçenek. Her kartta NFC çip ve dijital profil;
          profil linki ve QR kod da sizde. Kart istemeyenler için kartsız dijital kartvizit: link +
          QR, aylık 59,90 TL (yıllık 718,80 TL).
        </p>
        <PromiseStrip className="pt-2" />
      </div>

      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {FINISHES.map((f) => (
          <li key={f.id}>
            <Link href={`/kartvizit/${f.slug}`} className="group flex flex-col gap-4">
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
              <div className="flex flex-col gap-1.5">
                <h2 className="text-xl font-semibold tracking-tight group-hover:underline">
                  {f.name}
                </h2>
                <p className="text-lg font-medium">{formatPrice(f)}</p>
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

      <WhyDijivizit className="mt-20 border-t border-border/60 pt-16" />

      <div className="mt-20 grid gap-x-16 gap-y-14 border-t border-border/60 pt-16 lg:grid-cols-2">
        {nfc.sections.map((sec) => (
          <section key={sec.heading} className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-balance">{sec.heading}</h2>
            {sec.paragraphs?.map((p) => (
              <p key={p.slice(0, 40)} className="leading-relaxed text-pretty text-foreground/85">
                {p}
              </p>
            ))}
            {sec.list ? (
              <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-foreground/85">
                {sec.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <section className="mt-20 flex max-w-3xl flex-col gap-2 border-t border-border/60 pt-16">
        <h2 className="mb-4 text-3xl font-semibold tracking-tight">
          NFC kartvizit hakkında sık sorulanlar
        </h2>
        <div className="divide-y divide-border/60 border-y border-border/60">
          {nfc.faq.map(({ q, a }) => (
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
    </div>
  );
}
