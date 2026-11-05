import type { Metadata } from "next";
import Link from "next/link";

import { PromiseStrip } from "@/components/marketing/why-dijivizit";
import { CONTACT } from "@/lib/contact";
import { MARKETING_ORIGIN } from "@/lib/hosts";
import {
  CARD_FINISHES,
  FINISHES,
  PRICING,
  PROMISES,
  formatPrice,
  formatTry,
  isDigital,
} from "@/lib/orders/finishes";

const TITLE = "Dijivizit Hakkında: Kimiz, Ne Yapıyoruz? | Dijivizit";
const DESCRIPTION =
  "Dijivizit, Eskişehir'de ASD Tasarım Ltd. Şti. tarafından üretilen PVC, metal ve ahşap NFC kartvizit ile kartsız dijital kartvizit markasıdır. Ürünler, teslimat ve güvence.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/hakkimizda" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/hakkimizda" },
};

const FACTS: [string, string][] = [
  ["Marka", "Dijivizit"],
  ["Şirket", "ASD Tasarım Ltd. Şti."],
  ["Merkez ve üretim", CONTACT.addressLines.join(", ")],
  [
    "Ürünler",
    "PVC, metal ve ahşap NFC kartvizit, kartsız dijital kartvizit (link + QR), kurumsal ekip kartları",
  ],
  ["Kart seçenekleri", "Mat siyah PVC, siyah, gümüş ve gold metal, koyu ve açık ahşap"],
  [
    "Teslimat",
    `Kartlar ${PROMISES.deliveryHours} saatte, Türkiye'nin her yerine ücretsiz kargoyla; kartsız dijital kartvizit ${PROMISES.digitalDeliveryHours} saatte e-postayla`,
  ],
  ["Güvence", "Kart okunmazsa ücretsiz değişim, 14 gün cayma hakkı"],
  ["İletişim", `${CONTACT.phoneDisplay} (WhatsApp) · ${CONTACT.orderEmail}`],
];

const FAQ = [
  {
    q: "Dijivizit güvenilir mi?",
    a: `Dijivizit, Eskişehir'de faaliyet gösteren ASD Tasarım Ltd. Şti.'nin markasıdır. Ödemeler Shopier güvencesiyle alınır, kartlar ${PROMISES.deliveryHours} saatte teslim edilir, okunmayan kart ücretsiz değiştirilir ve 14 gün cayma hakkı vardır. Adres, telefon ve iade koşulları sitede açıkça yazar.`,
  },
  {
    q: "Dijivizit kartları hangi malzemeden?",
    a: "Mat siyah PVC, metal (siyah, gümüş, gold) ve gerçek ahşap (koyu, açık). Hepsinde NFC çip ve arkada QR kod vardır.",
  },
  {
    q: "Yıllık ücret var mı?",
    a: `Kartla birlikte gelen dijital profil ilk ${PRICING.profileFreeYears} yıl ücretsizdir; sonrasında aylık ${formatTry(PRICING.profileMonthlyFee)}. Otomatik çekim yapılmaz. Kartsız dijital kartvizit yıllık ${formatTry(PRICING.digitalYearlyFee)} olarak peşin ödenir.`,
  },
  {
    q: "Eskiden dijivizit.com'da kartı olanlar ne olacak?",
    a: "dijivizit.com alan adı daha önce başka bir kartvizit hizmetine aitti. Bugünkü Dijivizit ayrı bir şirkettir; eski hizmete ait profiller ve iletişim bilgileri bize ait değildir. Eski bir kartınız varsa bize yazın, yeni Dijivizit kartına geçişte yardımcı olalım.",
  },
];

export default function AboutPage() {
  const digital = FINISHES.find(isDigital)!;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${MARKETING_ORIGIN}/hakkimizda#page`,
        url: `${MARKETING_ORIGIN}/hakkimizda`,
        name: TITLE,
        inLanguage: "tr-TR",
        about: { "@id": `${MARKETING_ORIGIN}/#organization` },
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

  return (
    <article className="mx-auto w-full max-w-6xl px-6 pt-32 pb-28 sm:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header className="flex max-w-3xl flex-col gap-5">
        <p className="text-sm text-muted-foreground">Hakkımızda</p>
        <h1 className="text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl">
          Dijivizit, Eskişehir&apos;den dijital ve NFC kartvizit.
        </h1>
        <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
          Dijivizit, ASD Tasarım Ltd. Şti.&apos;nin markasıdır. PVC, metal ve ahşap NFC kartvizitleri
          Eskişehir&apos;de üretiyor, dijital profil altyapısını kendimiz geliştiriyoruz. Kartı
          telefona dokundurduğunuzda ya da arkasındaki QR kodu okuttuğunuzda profiliniz açılır;
          karşı taraf sizi tek dokunuşla rehberine kaydeder. Uygulama gerekmez.
        </p>
        <PromiseStrip className="pt-2" />
      </header>

      <section className="mt-16 max-w-3xl border-t border-border/60 pt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Kısaca Dijivizit</h2>
        <dl className="mt-6 divide-y divide-border/60">
          {FACTS.map(([k, v]) => (
            <div key={k} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
              <dt className="text-sm text-muted-foreground">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16 max-w-3xl border-t border-border/60 pt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Ürünler ve fiyatlar</h2>
        <ul className="mt-6 flex flex-col gap-2">
          {[...CARD_FINISHES, digital].map((f) => (
            <li key={f.id} className="flex items-baseline justify-between gap-4">
              <Link href={`/kartvizit/${f.slug}`} className="underline-offset-4 hover:underline">
                {f.name}
              </Link>
              <span className="text-muted-foreground tabular-nums">{formatPrice(f)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          Fiyatlara KDV dahildir. {PRICING.bulkMinQuantity} ve üzeri adette %
          {PRICING.bulkDiscountPercent} indirim; kurumsal siparişte firma logonuz karta işlenir.
        </p>
      </section>

      <section className="mt-16 max-w-3xl border-t border-border/60 pt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Sık sorulanlar</h2>
        <div className="mt-6 flex flex-col gap-6">
          {FAQ.map((f) => (
            <div key={f.q} className="flex flex-col gap-1.5">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="leading-relaxed text-foreground/85">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/yasal/teslimat-ve-iade" className="underline underline-offset-4">
            Teslimat ve İade Koşulları
          </Link>
          <a
            href={CONTACT.mapsProfileUrl}
            target="_blank"
            rel="noopener"
            className="underline underline-offset-4"
          >
            Google Haritalar&apos;da Dijivizit
          </a>
          <Link href="/siparis" className="underline underline-offset-4">
            Sipariş ver
          </Link>
        </p>
      </section>
    </article>
  );
}
