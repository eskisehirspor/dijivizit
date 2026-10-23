import type { Metadata } from "next";
import Link from "next/link";

import { FinishPicker } from "@/components/marketing/finish-picker";
import { ScrollSequence, type SequenceCaption } from "@/components/marketing/scroll-sequence";
import { COMPARISON, FAQ, KEYWORDS, USE_CASES } from "@/components/marketing/seo-content";
import { APP_ORIGIN, MARKETING_ORIGIN } from "@/lib/hosts";
import { routes } from "@/lib/routes";

const TITLE = "NFC Kartvizit ve Akıllı Dijital Kartvizit | Dijivizit";
const DESCRIPTION =
  "Dijivizit NFC kartvizit: telefona dokundur, profilin açılsın. Metal, gold, gümüş ve ahşap akıllı kartvizit; QR kod, temassız paylaşım ve anında güncelleme.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [...KEYWORDS],
  alternates: { canonical: "/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const FINISH_IMAGES = ["black", "silver", "gold", "wood", "wood-light"].map(
  (f) => `${MARKETING_ORIGIN}/landing/finishes/${f}.webp`,
);

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${MARKETING_ORIGIN}/#organization`,
      name: "Dijivizit",
      url: MARKETING_ORIGIN,
      logo: `${MARKETING_ORIGIN}/email/logomark.png`,
      email: "merhaba@dijivizit.com",
    },
    {
      "@type": "WebSite",
      "@id": `${MARKETING_ORIGIN}/#website`,
      url: MARKETING_ORIGIN,
      name: "Dijivizit",
      inLanguage: "tr-TR",
      publisher: { "@id": `${MARKETING_ORIGIN}/#organization` },
    },
    {
      "@type": "Product",
      name: "Dijivizit NFC Akıllı Kartvizit",
      description: DESCRIPTION,
      brand: { "@type": "Brand", name: "Dijivizit" },
      category: "NFC kartvizit",
      image: FINISH_IMAGES,
      material: "Metal, ahşap",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

const CAPTIONS: SequenceCaption[] = [
  {
    start: 0,
    end: 0.14,
    kicker: "NFC akıllı kartvizit",
    title: "Tanışmanın yeni hali.",
    heading: "h1",
    body: "Kartvizitini bir kez tasarla. Bir dokunuşla paylaş, sonsuza dek güncel kalsın.",
    place: "top",
  },
  {
    start: 0.3,
    end: 0.42,
    kicker: "Kart",
    title: "Metal. NFC. QR.",
    body: "Siyah metal, gümüş, gold ya da ahşap. İçinde NFC çip, üstünde dinamik QR.",
    place: "left",
  },
  {
    start: 0.52,
    end: 0.64,
    kicker: "Paylaş",
    title: "Dokun. O kadar.",
    body: "Kartı telefona yaklaştır, profilin açılır. Karşı taraf uygulama indirmez.",
    place: "left",
  },
  {
    start: 0.72,
    end: 0.84,
    kicker: "Profil",
    title: "Her şey tek sayfada.",
    body: "Telefon, WhatsApp, LinkedIn, IBAN, belgeler. Sen güncelledikçe kartın da güncellenir.",
    place: "left",
  },
  {
    start: 0.9,
    end: 1.02,
    kicker: "Kaydet",
    title: "Tek dokunuşla rehberde.",
    body: "Tanıştığın kişi seni bir dokunuşla rehberine ekler. Kaybolan kartvizit yok.",
    place: "left",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Profilini kur",
    body: "Ad, unvan, iletişim, sosyal hesaplar, IBAN ve belgeler. Birkaç dakikada hazır.",
  },
  {
    n: "02",
    title: "Kartını al",
    body: "Metal NFC kartın profiline bağlı gelir. Kart hiç değişmez, içeriği sen değiştirirsin.",
  },
  {
    n: "03",
    title: "Dokun ve paylaş",
    body: "Telefona dokundur ya da QR'ı okut. Profilin anında açılır, uygulama gerekmez.",
  },
];

export default function HomePage() {
  const loginHref = `${APP_ORIGIN}${routes.login}`;
  const registerHref = `${APP_ORIGIN}${routes.register}`;

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output is safe here: all values are static strings.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
      <header className="fixed inset-x-0 top-0 z-30">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-70">
            <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" />
              <circle cx="8.6" cy="12" r="1.35" fill="white" />
              <g fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round">
                <path d="M12.1 8.3a4.6 4.6 0 0 1 0 7.4" />
                <path d="M15.4 5.9a8.6 8.6 0 0 1 0 12.2" />
              </g>
            </svg>
            <span className="text-lg font-semibold tracking-[-0.03em]">Dijivizit</span>
          </Link>
          <nav className="flex items-center gap-2">
            <a
              href={loginHref}
              className="rounded-full px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-white/50"
            >
              Giriş yap
            </a>
            <a
              href={registerHref}
              className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Başla
            </a>
          </nav>
        </div>
      </header>

      <ScrollSequence
        desktop={{ base: "/landing/desktop", count: 192, width: 1600, height: 900 }}
        mobile={{ base: "/landing/mobile", count: 192, width: 900, height: 1600 }}
        captions={CAPTIONS}
      />

      <section className="mx-auto w-full max-w-6xl px-6 pt-28 sm:pt-36">
        <div className="mb-12 flex max-w-2xl flex-col gap-4">
          <p className="text-sm font-medium tracking-wide text-muted-foreground">Kaplamalar</p>
          <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
            Beş kaplama. Tek dokunuş.
          </h2>
        </div>
        <FinishPicker />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-28 sm:py-36">
        <div className="flex max-w-2xl flex-col gap-4">
          <p className="text-sm font-medium tracking-wide text-muted-foreground">Nasıl çalışır</p>
          <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
            Üç adım. Bir jest.
          </h2>
        </div>
        <ol className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-10">
          {STEPS.map((step) => (
            <li key={step.n} className="flex flex-col gap-3 border-t border-border/60 pt-6">
              <span className="font-mono text-sm text-muted-foreground">{step.n}</span>
              <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
              <p className="text-base leading-relaxed text-pretty text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-28 sm:py-36">
          <div className="flex max-w-2xl flex-col gap-4">
            <p className="text-sm font-medium tracking-wide text-muted-foreground">Kimler için</p>
            <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
              Her tanışma bir fırsat.
            </h2>
          </div>
          <ul className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {USE_CASES.map((item) => (
              <li key={item.title} className="flex flex-col gap-3 border-t border-border/60 pt-6">
                <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="text-base leading-relaxed text-pretty text-muted-foreground">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-28 sm:py-36">
          <div className="flex max-w-2xl flex-col gap-4">
            <p className="text-sm font-medium tracking-wide text-muted-foreground">
              Kağıt kartvizit ve dijital kartvizit
            </p>
            <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
              Bir kez al. Hep güncel kalsın.
            </h2>
          </div>
          <div className="mt-16 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-base">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th scope="col" className="py-4 pr-6 font-medium">
                    <span className="sr-only">Özellik</span>
                  </th>
                  <th scope="col" className="py-4 pr-6 font-medium">
                    Kağıt kartvizit
                  </th>
                  <th scope="col" className="py-4 font-medium text-foreground">
                    Dijivizit NFC kartvizit
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(([label, paper, digital]) => (
                  <tr key={label} className="border-b border-border/60">
                    <th scope="row" className="py-5 pr-6 font-medium">
                      {label}
                    </th>
                    <td className="py-5 pr-6 text-muted-foreground">{paper}</td>
                    <td className="py-5">{digital}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-28 sm:py-36 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium tracking-wide text-muted-foreground">
              Sık sorulan sorular
            </p>
            <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
              NFC kartvizit hakkında.
            </h2>
          </div>
          <div className="divide-y divide-border/60 border-y border-border/60">
            {FAQ.map(({ q, a }) => (
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
                <p className="pb-5 text-base leading-relaxed text-pretty text-muted-foreground">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 py-28 sm:py-36">
          <h2 className="max-w-3xl text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-7xl">
            Kartvizit bitti.
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
            Dijivizit şu an davetle açılıyor. Davet kodun varsa hemen başla; yoksa bize yaz, sırana
            ekleyelim.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={registerHref}
              className="inline-flex h-12 items-center rounded-full bg-neutral-950 px-6 text-base font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Davet koduyla başla
            </a>
            <a
              href="mailto:merhaba@dijivizit.com?subject=Dijivizit%20davet%20talebi"
              className="inline-flex h-12 items-center rounded-full border border-border px-6 text-base font-medium transition-colors hover:bg-muted"
            >
              Davet iste
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
