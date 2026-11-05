import type { Metadata } from "next";
import Link from "next/link";

import { MARKETING_ORIGIN } from "@/lib/hosts";
import { FREE_PERIOD } from "@/lib/marketing/card-cost";
import { productFeatures } from "@/lib/marketing/products";
import {
  CARD_FINISHES,
  FINISHES,
  PRICING,
  PROMISES,
  formatPrice,
  formatTry,
  unitPrice,
  type Finish,
} from "@/lib/orders/finishes";

const PATH = "/dijital-kartvizit-fiyatlari";
const PAGE_URL = `${MARKETING_ORIGIN}${PATH}`;

const byMaterial = (m: Finish["material"]) => FINISHES.find((f) => f.material === m)!;
const PVC = byMaterial("pvc");
const WOOD = byMaterial("wood");
const METAL = byMaterial("metal");
const DIGITAL = byMaterial("digital");

const fee = formatTry(PRICING.profileMonthlyFee);
const bulk = `${PRICING.bulkMinQuantity}+ adette %${PRICING.bulkDiscountPercent} indirim`;
const minCard = Math.min(...CARD_FINISHES.map((f) => f.price));
const maxCard = Math.max(...CARD_FINISHES.map((f) => f.price));

const TITLE = "Dijital Kartvizit Fiyatları 2026: NFC, Metal, Ahşap | Dijivizit";
const DESCRIPTION = `Dijital kartvizit fiyatları: NFC kart ${formatTry(minCard)}–${formatTry(maxCard)}, kartsız aylık ${fee}. Profil ${FREE_PERIOD} ücretsiz, KDV dahil, kargo ücretsiz, ${bulk}.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const YEARS = 3;
const TEAM = PRICING.bulkMinQuantity;

/** Total for `people` over YEARS years: card once, profile after the free years; card-less yearly. */
function totalCost(finish: Finish, people: number): number {
  if (finish.material === "digital") {
    const discount = people >= PRICING.bulkMinQuantity ? PRICING.bulkDiscountPercent / 100 : 0;
    // Discount on the first yearly order; renewals at list price.
    return Math.round(PRICING.digitalYearlyFee * people * (1 - discount + (YEARS - 1)) * 100) / 100;
  }
  const paidYears = Math.max(0, YEARS - PRICING.profileFreeYears);
  const total =
    unitPrice(finish, people) * people + PRICING.profileMonthlyFee * 12 * paidYears * people;
  return Math.round(total * 100) / 100;
}

const EXAMPLES = [
  { label: "Siyah mat PVC", finish: PVC },
  { label: "Ahşap", finish: WOOD },
  { label: "Metal", finish: METAL },
  { label: "Kartsız (link + QR)", finish: DIGITAL },
];

const FAQ = [
  {
    q: "Dijital kartvizit fiyatları ne kadar?",
    a: `Mat siyah PVC ve ahşap NFC kartvizit ${formatTry(PVC.price)}, metal NFC kartvizit ${formatTry(METAL.price)}. Kart istemeyenler için kartsız dijital kartvizit aylık ${fee}, yıllık ${formatTry(PRICING.digitalYearlyFee)} olarak ödenir. Fiyatlara KDV dahildir.`,
  },
  {
    q: "Dijital kartvizitin aylık ücreti var mı?",
    a: `NFC kartla birlikte dijital profil ${FREE_PERIOD} ücretsizdir. Sonrasında aylık ${fee} ile devam edebilirsin. Otomatik çekim yapılmaz; devam edip etmemeye sen karar verirsin.`,
  },
  {
    q: "Toplu siparişte indirim var mı?",
    a: `Evet. ${PRICING.bulkMinQuantity} ve üzeri adetlik siparişlerde tüm kartlarda %${PRICING.bulkDiscountPercent} indirim uygulanır. Kartlar farklı kişilere ait olabilir; her biri kendi profilini alır.`,
  },
  {
    q: "Kargo ve teslimat ücretli mi?",
    a: `Kargo ücretsizdir. Kartlar ${PROMISES.deliveryHours} saat içinde teslim edilir; kartsız dijital kartvizitte link ve QR kod ${PROMISES.digitalDeliveryHours} saat içinde e-postana gelir.`,
  },
  {
    q: "Kart çalışmazsa ya da vazgeçersem ne olur?",
    a: "Kart okunmazsa ücretsiz yenisiyle değiştirilir. Teslimden sonra 14 gün içinde cayma hakkını kullanabilirsin.",
  },
];

export default function PricesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "tr-TR",
        isPartOf: { "@id": `${MARKETING_ORIGIN}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Dijivizit", item: `${MARKETING_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Dijital kartvizit fiyatları", item: PAGE_URL },
        ],
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

  const prose = "leading-relaxed text-pretty text-foreground/85";
  const link = "font-medium underline underline-offset-4 hover:text-foreground";

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
        <span>Dijital kartvizit fiyatları</span>
      </nav>

      <header className="mb-16 flex max-w-3xl flex-col gap-6">
        <h1 className="text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-7xl">
          Dijital Kartvizit Fiyatları 2026
        </h1>
        <p className="text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
          Dijivizit&apos;te NFC kartvizit {formatTry(PVC.price)} (mat siyah PVC ve ahşap) ile{" "}
          {formatTry(METAL.price)} (metal) arasındadır; kartsız dijital kartvizit aylık {fee}.
          Fiyatlara KDV dahildir, kargo ücretsizdir. Kart bir kez ödenir, dijital profil{" "}
          {FREE_PERIOD} ücretsizdir, sonra aylık {fee}; otomatik çekim yoktur. {bulk} uygulanır.
        </p>
      </header>

      <section aria-labelledby="fiyat-tablosu" className="flex flex-col gap-6">
        <h2 id="fiyat-tablosu" className="text-3xl font-semibold tracking-tight">
          Fiyat tablosu
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border/60">
          <table className="w-full min-w-[560px] text-left tabular-nums">
            <caption className="sr-only">Dijivizit ürünleri ve KDV dahil fiyatları</caption>
            <thead className="bg-muted/60 text-sm text-muted-foreground">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">
                  Ürün
                </th>
                <th scope="col" className="px-5 py-3 text-right font-medium">
                  Fiyat
                </th>
                <th scope="col" className="px-5 py-3 text-right font-medium">
                  {PRICING.bulkMinQuantity}+ adet (birim)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {FINISHES.map((f) => (
                <tr key={f.id}>
                  <th scope="row" className="px-5 py-4 font-normal">
                    <Link
                      href={`/kartvizit/${f.slug}`}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {f.name}
                    </Link>
                    <span className="block text-sm text-muted-foreground">{f.note}</span>
                  </th>
                  <td className="px-5 py-4 text-right font-medium whitespace-nowrap">
                    {formatPrice(f)}
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap text-muted-foreground">
                    {formatPrice(f, unitPrice(f, PRICING.bulkMinQuantity))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          Tüm fiyatlara KDV dahildir. Kartsız dijital kartvizit yıllık{" "}
          {formatTry(PRICING.digitalYearlyFee)} olarak peşin ödenir.{" "}
          <Link href="/kartvizit" className={link}>
            Tüm kartları fotoğraflarıyla gör
          </Link>
          .
        </p>
      </section>

      <div className="mt-24 grid gap-x-16 gap-y-14 border-t border-border/60 pt-16 lg:grid-cols-2">
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Fiyata neler dahil?</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-foreground/85">
            {productFeatures(PVC)
              .slice(1)
              .map((item) => (
                <li key={item}>{item}</li>
              ))}
            <li>
              Ücretsiz kargo, {PROMISES.deliveryHours} saatte teslim; kart okunmazsa ücretsiz
              değişim; 14 gün cayma hakkı.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Abonelik nasıl işliyor?</h2>
          <p className={prose}>
            NFC kart tek seferlik ödenir. Kartla birlikte gelen dijital profil (rehbere kaydet,
            bilgi bırakma formu, analitik) {FREE_PERIOD} ücretsizdir. Süre dolunca devam etmek
            istersen aylık {fee} ödersin. Otomatik çekim yapılmaz.
          </p>
          <p className={prose}>
            Kart istemiyorsan kartsız dijital kartvizit yıllık {formatTry(PRICING.digitalYearlyFee)}{" "}
            (aylık {fee}) ile link ve QR kod verir. Daha fazlası için{" "}
            <Link href="/rehber/dijital-kartvizit-aylik-ucret-var-mi" className={link}>
              dijital kartvizitin aylık ücreti var mı?
            </Link>
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Toplu sipariş indirimi</h2>
          <p className={prose}>
            {PRICING.bulkMinQuantity} ve üzeri adetlik siparişlerde her kartta %
            {PRICING.bulkDiscountPercent} indirim uygulanır: metal kart{" "}
            {formatTry(unitPrice(METAL, TEAM))}, PVC ve ahşap {formatTry(unitPrice(PVC, TEAM))}{" "}
            olur. Kartlar farklı kişilere ait olabilir; herkes kendi profilini yönetir.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Kâğıt kartvizitle karşılaştırma</h2>
          <p className={prose}>
            Kâğıt kartvizitin tanesi ucuzdur, ama her unvan, numara ya da adres değişikliğinde elde
            kalanlar çöpe gider ve yeniden baskı gerekir. NFC kartta bilgiler panelden değişir, kart
            aynı kalır. Az kart dağıtan ve bilgileri yıllarca değişmeyen biri için kâğıt hâlâ daha
            ucuz olabilir; ekiplerde ise fark birkaç yıl içinde kapanır.{" "}
            <Link href="/kartvizit-maliyet-hesaplama" className={link}>
              Kendi rakamlarınla hesapla
            </Link>
            .
          </p>
        </section>
      </div>

      <section
        aria-labelledby="uc-yil"
        className="mt-20 flex flex-col gap-6 border-t border-border/60 pt-16"
      >
        <h2 id="uc-yil" className="text-3xl font-semibold tracking-tight">
          {YEARS} yıllık toplam maliyet örneği
        </h2>
        <p className={`max-w-3xl ${prose}`}>
          Kart bedeli, ücretsiz{" "}
          {PRICING.profileFreeYears === 1 ? "ilk yıldan" : `ilk ${PRICING.profileFreeYears} yıldan`}{" "}
          sonraki profil ücretleriyle birlikte. Kartsız seçenekte {YEARS} yıllık ödeme; ekip
          indirimi yalnızca ilk yıla uygulandı.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-border/60">
          <table className="w-full min-w-[520px] text-left tabular-nums">
            <caption className="sr-only">{YEARS} yıllık toplam maliyet, KDV dahil</caption>
            <thead className="bg-muted/60 text-sm text-muted-foreground">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">
                  Kart tipi
                </th>
                <th scope="col" className="px-5 py-3 text-right font-medium">
                  1 kişi
                </th>
                <th scope="col" className="px-5 py-3 text-right font-medium">
                  {TEAM} kişilik ekip
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {EXAMPLES.map(({ label, finish }) => (
                <tr key={finish.id}>
                  <th scope="row" className="px-5 py-4 font-medium">
                    {label}
                  </th>
                  <td className="px-5 py-4 text-right">{formatTry(totalCost(finish, 1))}</td>
                  <td className="px-5 py-4 text-right">{formatTry(totalCost(finish, TEAM))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-20 grid gap-12 border-t border-border/60 pt-16 lg:grid-cols-[1fr_1.4fr]">
        <h2 className="text-3xl font-semibold tracking-tight text-balance">Sık sorulanlar</h2>
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
              <p className="pb-5 leading-relaxed text-pretty text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-20 flex flex-col gap-6 rounded-3xl bg-neutral-950 p-8 text-white sm:p-12">
        <h2 className="text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl">
          Kartını seç, {PROMISES.deliveryHours} saatte elinde olsun.
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/siparis"
            className="inline-flex h-12 items-center rounded-full bg-white px-7 text-base font-medium text-neutral-950 transition-colors hover:bg-white/90 focus-visible:ring-[3px] focus-visible:ring-white/60 focus-visible:outline-none"
          >
            Sipariş ver
          </Link>
          <Link
            href="/kartvizit"
            className="inline-flex h-12 items-center rounded-full border border-white/30 px-7 text-base font-medium transition-colors hover:bg-white/10 focus-visible:ring-[3px] focus-visible:ring-white/60 focus-visible:outline-none"
          >
            Kartları incele
          </Link>
        </div>
      </section>
    </article>
  );
}
