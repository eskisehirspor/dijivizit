import type { Metadata } from "next";
import Link from "next/link";

import { AppScreens } from "@/components/marketing/app-screens";
import { FeatureShowcase } from "@/components/marketing/feature-showcase";
import { ContactDetails } from "@/components/marketing/contact-details";
import { FinishPicker } from "@/components/marketing/finish-picker";
import { LifestyleImage } from "@/components/marketing/lifestyle-image";
import { ScrollSequence, type SequenceCaption } from "@/components/marketing/scroll-sequence";
import { COMPARISON, FAQ, KEYWORDS, USE_CASES } from "@/components/marketing/seo-content";
import { CONTACT } from "@/lib/contact";
import { APP_ORIGIN, MARKETING_ORIGIN } from "@/lib/hosts";
import { routes } from "@/lib/routes";

const TITLE = "Dijivizit | NFC Kartvizit ve Akıllı Dijital Kartvizit";
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

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": `${MARKETING_ORIGIN}/#organization`,
      name: "Dijivizit",
      url: MARKETING_ORIGIN,
      logo: `${MARKETING_ORIGIN}/email/logomark.png`,
      image: `${MARKETING_ORIGIN}/landing/finishes/black.webp`,
      email: CONTACT.orderEmail,
      telephone: CONTACT.phoneE164,
      address: {
        "@type": "PostalAddress",
        streetAddress: CONTACT.street,
        addressLocality: CONTACT.district,
        addressRegion: CONTACT.city,
        addressCountry: CONTACT.country,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${MARKETING_ORIGIN}/#website`,
      url: MARKETING_ORIGIN,
      name: "Dijivizit",
      alternateName: ["Dijivizit NFC Kartvizit", "dijivizit.com"],
      inLanguage: "tr-TR",
      publisher: { "@id": `${MARKETING_ORIGIN}/#organization` },
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
    place: "hero",
  },
  {
    start: 0.3,
    end: 0.42,
    kicker: "Kart",
    title: "Metal. NFC. QR.",
    body: "Siyah metal, gümüş, gold ya da ahşap. İçinde NFC çip, üstünde QR kod.",
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
  const registerHref = `${APP_ORIGIN}${routes.register}`;

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output is safe here: all values are static strings.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />

      <ScrollSequence
        desktop={{ base: "/landing/desktop", count: 192, width: 2560, height: 1440 }}
        mobile={{ base: "/landing/mobile", count: 192, width: 1170, height: 2080 }}
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

      <section className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-28 sm:py-36 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
        <div>
          <div className="flex max-w-2xl flex-col gap-4">
            <p className="text-sm font-medium tracking-wide text-muted-foreground">Nasıl çalışır</p>
            <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
              Üç adım. Bir jest.
            </h2>
          </div>
          <ol className="mt-16 grid gap-10">
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
        </div>
        <LifestyleImage
          src="/landing/lifestyle/tap.webp"
          alt="Siyah Dijivizit NFC kartvizit telefona dokunduruluyor, ekranda dijital profil açılmış"
        />
      </section>

      <section className="border-t border-border/60 bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-28 sm:py-36">
          <div className="flex max-w-2xl flex-col gap-4">
            <p className="text-sm font-medium tracking-wide text-muted-foreground">Arayüz</p>
            <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
              Kartınız telefonda böyle açılır.
            </h2>
            <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
              Karşınızdaki kişi uygulama indirmez. Kartı telefonuna yaklaştırır, profiliniz
              tarayıcıda açılır; sizi tek dokunuşla arar, yazar ya da rehberine kaydeder.
            </p>
          </div>
          <AppScreens />
        </div>
      </section>

      <section id="ozellikler" className="scroll-mt-20 border-t border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 py-28 sm:py-36">
          <div className="flex max-w-2xl flex-col gap-4">
            <p className="text-sm font-medium tracking-wide text-muted-foreground">
              Kart verildikten sonra
            </p>
            <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
              Tanışma kartla bitmez.
            </h2>
            <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
              Dijivizit yalnızca bilginizi vermez. Karşınızdakinin bilgisini de alır, hatırlatır ve
              ekibinizle birlikte yönetmenizi sağlar.
            </p>
          </div>
          <FeatureShowcase />
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-28 sm:py-36 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
          <LifestyleImage
            src="/landing/lifestyle/handover.webp"
            alt="Toplantı masasında Dijivizit metal kartvizit karşı tarafa uzatılıyor"
          />
          <div className="order-first">
            <div className="flex max-w-2xl flex-col gap-4">
              <p className="text-sm font-medium tracking-wide text-muted-foreground">Kimler için</p>
              <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
                Her tanışma bir fırsat.
              </h2>
            </div>
            <ul className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2">
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
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-28 sm:py-36 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
          <div className="min-w-0">
            <div className="flex max-w-2xl flex-col gap-4">
              <p className="text-sm font-medium tracking-wide text-muted-foreground">
                Kağıt kartvizit ve dijital kartvizit
              </p>
              <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
                Bir kez al. Hep güncel kalsın.
              </h2>
            </div>
            <div className="mt-16 overflow-x-auto">
              <table className="w-full min-w-[30rem] text-left text-base">
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
          <LifestyleImage
            src="/landing/lifestyle/collection.webp"
            alt="Dijivizit NFC kartvizit kaplamaları: açık ve koyu ahşap, gold, gümüş ve siyah metal"
          />
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
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-28 sm:py-36 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
          <div className="flex flex-col items-start gap-8">
            <h2 className="max-w-3xl text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-7xl">
              Kartvizit bitti.
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
              Kaplamanı seç, bilgilerini bırak; seni arayıp kartını birlikte hazırlayalım. Davet
              kodun varsa hemen hesabını da oluşturabilirsin.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/siparis"
                className="inline-flex h-12 items-center rounded-full bg-neutral-950 px-6 text-base font-medium text-white transition-colors hover:bg-neutral-800"
              >
                Talep oluştur
              </Link>
              <a
                href={registerHref}
                className="inline-flex h-12 items-center rounded-full border border-border px-6 text-base font-medium transition-colors hover:bg-muted"
              >
                Davet koduyla başla
              </a>
            </div>
          </div>
          <LifestyleImage
            src="/landing/lifestyle/hand.webp"
            alt="Elde tutulan mat siyah metal Dijivizit NFC kartvizit"
          />
        </div>
      </section>
      <section id="iletisim" className="scroll-mt-20 border-t border-border/60">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-28 sm:py-36 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium tracking-wide text-muted-foreground">İletişim</p>
            <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
              Bize ulaş.
            </h2>
            <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
              Kurumsal siparişler, numune kart ya da aklına takılan her şey için ara, yaz ya da
              Eskişehir&rsquo;deki atölyemize uğra.
            </p>
          </div>
          <ContactDetails />
        </div>
      </section>
    </>
  );
}
