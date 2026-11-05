"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { trackTool } from "@/lib/analytics";
import {
  COST_OPTIONS,
  COST_YEARS_MAX,
  DEFAULT_PAPER_PACK_PRICE,
  FREE_PERIOD,
  PAPER_PACK_SIZE,
  compareCardCosts,
  costFinish,
  type CostOptionId,
} from "@/lib/marketing/card-cost";
import { PRICING, PROMISES, formatPrice, formatTry } from "@/lib/orders/finishes";
import { cn } from "@/lib/utils";

const TOOL = "kartvizit-maliyet-hesaplama";

type NumKey = "people" | "cardsPerPersonPerYear" | "paperPackPrice" | "reprintsPerYear" | "years";

const NUM_INPUTS: {
  key: NumKey;
  label: string;
  hint?: string;
  min: number;
  max: number;
  step?: number;
}[] = [
  { key: "people", label: "Kaç kişi kartvizit kullanıyor?", min: 1, max: 10000 },
  {
    key: "cardsPerPersonPerYear",
    label: "Kişi başı yılda kaç kartvizit dağıtılıyor?",
    min: 0,
    max: 100000,
    step: 10,
  },
  {
    key: "paperPackPrice",
    label: `Kâğıt kartvizit ${PAPER_PACK_SIZE.toLocaleString("tr-TR")} adet fiyatı (TL)`,
    hint: "Kendi matbaa fiyatınızı girin.",
    min: 0,
    max: 1000000,
    step: 50,
  },
  {
    key: "reprintsPerYear",
    label: "Bilgiler yılda kaç kez değişip yeniden basılıyor?",
    hint: "Unvan, telefon, adres ya da logo değişikliği.",
    min: 0,
    max: 12,
  },
  {
    key: "years",
    label: `Kaç yıllık karşılaştırma? (1–${COST_YEARS_MAX})`,
    min: 1,
    max: COST_YEARS_MAX,
  },
];

const inputClass =
  "h-12 w-full rounded-xl border border-input bg-background px-4 text-base tabular-nums outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

/** Free tool: paper vs Dijivizit card cost over 1–5 years, computed in the browser. */
export function CostCalculator() {
  const [values, setValues] = useState<Record<NumKey, string>>({
    people: "1",
    cardsPerPersonPerYear: "300",
    paperPackPrice: String(DEFAULT_PAPER_PACK_PRICE),
    reprintsPerYear: "1",
    years: "3",
  });
  const [option, setOption] = useState<CostOptionId>("pvc-black");
  const started = useRef(false);

  function markStarted() {
    if (!started.current) {
      started.current = true;
      trackTool(TOOL, "tool_start");
    }
  }

  const num = (k: NumKey) => Number(values[k].replace(",", ".")) || 0;
  const r = compareCardCosts({
    people: num("people"),
    cardsPerPersonPerYear: num("cardsPerPersonPerYear"),
    paperPackPrice: num("paperPackPrice"),
    reprintsPerYear: num("reprintsPerYear"),
    years: num("years"),
    option,
  });
  const finish = costFinish(option);
  const digital = finish.material === "digital";
  const years = r.byYear.length;
  const people = Math.max(1, Math.floor(num("people")));
  const diff = r.paperTotal - r.dijivizitTotal;
  const cheaper = diff > 0 ? "dijivizit" : diff < 0 ? "paper" : "equal";

  const verdict =
    cheaper === "dijivizit"
      ? `${years} yılda Dijivizit ${formatTry(diff)} daha ucuz.`
      : cheaper === "paper"
        ? `${years} yılda kâğıt kartvizit ${formatTry(-diff)} daha ucuz.`
        : `${years} yılda iki seçenek aynı tutuyor.`;

  const breakEven =
    r.breakEvenYear === null
      ? "Bu girdilerle Dijivizit seçtiğin süre içinde kâğıdın maliyetini yakalamıyor. Bilgilerin nadiren değişiyor ve az kart dağıtıyorsan kâğıt kartvizit mantıklı bir seçim."
      : r.breakEvenYear === 1
        ? "Dijivizit ilk yıldan itibaren kâğıttan ucuz ya da ona eşit."
        : `Dijivizit ${r.breakEvenYear}. yılın sonunda kâğıdın toplam maliyetine yetişiyor; ondan sonrası kazanç.`;

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-10 rounded-3xl border border-border/60 p-6 sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <form
          className="grid content-start gap-5"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Maliyet bilgileri"
        >
          {NUM_INPUTS.map((i) => (
            <div key={i.key} className="flex flex-col gap-2">
              <label htmlFor={`mc-${i.key}`} className="text-sm font-medium">
                {i.label}
              </label>
              <input
                id={`mc-${i.key}`}
                type="number"
                inputMode="decimal"
                min={i.min}
                max={i.max}
                step={i.step ?? 1}
                value={values[i.key]}
                aria-describedby={i.hint ? `mc-${i.key}-hint` : undefined}
                onChange={(e) => {
                  markStarted();
                  setValues((v) => ({ ...v, [i.key]: e.target.value }));
                }}
                className={inputClass}
              />
              {i.hint ? (
                <p id={`mc-${i.key}-hint`} className="text-sm text-muted-foreground">
                  {i.hint}
                </p>
              ) : null}
            </div>
          ))}

          <fieldset className="flex flex-col">
            <legend className="mb-3 text-sm font-medium">Dijivizit kart tipi</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {COST_OPTIONS.map((o) => {
                const f = costFinish(o.id);
                return (
                  <label
                    key={o.id}
                    className="flex cursor-pointer flex-col rounded-xl border border-border px-4 py-3 text-sm has-[:checked]:border-foreground has-[:checked]:bg-muted has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50"
                  >
                    <input
                      type="radio"
                      name="mc-option"
                      value={o.id}
                      checked={option === o.id}
                      onChange={() => {
                        markStarted();
                        setOption(o.id);
                      }}
                      className="sr-only"
                    />
                    <span className="font-medium">{o.label}</span>
                    <span className="text-muted-foreground">
                      {f.material === "digital"
                        ? `Yıllık ${formatTry(PRICING.digitalYearlyFee)}`
                        : formatPrice(f)}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </form>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3" role="status" aria-live="polite">
            <p className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
              {verdict}
            </p>
            <p className="leading-relaxed text-pretty text-muted-foreground">{breakEven}</p>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60">
            <div
              className={cn(
                "flex flex-col gap-1 bg-background p-5",
                cheaper === "paper" && "bg-muted",
              )}
            >
              <dt className="text-sm text-muted-foreground">Kâğıt kartvizit</dt>
              <dd className="text-2xl font-semibold tabular-nums">{formatTry(r.paperTotal)}</dd>
              <dd className="text-sm text-muted-foreground">
                Kişi başı {r.paperPacksPerPerson} baskı × {PAPER_PACK_SIZE.toLocaleString("tr-TR")}{" "}
                adet
              </dd>
            </div>
            <div
              className={cn(
                "flex flex-col gap-1 bg-background p-5",
                cheaper === "dijivizit" && "bg-muted",
              )}
            >
              <dt className="text-sm text-muted-foreground">Dijivizit {finish.label}</dt>
              <dd className="text-2xl font-semibold tabular-nums">{formatTry(r.dijivizitTotal)}</dd>
              <dd className="text-sm text-muted-foreground">
                {digital
                  ? `${people} kişi, yıllık ödeme`
                  : `Kart ${formatTry(r.cardTotal)} + profil ${formatTry(r.subscriptionTotal)}`}
              </dd>
            </div>
          </dl>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm tabular-nums">
              <caption className="sr-only">Yıllara göre toplam maliyet (kümülatif)</caption>
              <thead className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Yıl sonu
                  </th>
                  <th scope="col" className="py-2 pr-4 text-right font-medium">
                    Kâğıt toplam
                  </th>
                  <th scope="col" className="py-2 pr-4 text-right font-medium">
                    Dijivizit toplam
                  </th>
                  <th scope="col" className="py-2 text-right font-medium">
                    Fark
                  </th>
                </tr>
              </thead>
              <tbody>
                {r.byYear.map((y) => {
                  const d = y.paper - y.dijivizit;
                  return (
                    <tr key={y.year} className="border-b border-border/40">
                      <th scope="row" className="py-2.5 pr-4 font-medium">
                        {y.year}. yıl
                      </th>
                      <td className="py-2.5 pr-4 text-right">{formatTry(y.paper)}</td>
                      <td className="py-2.5 pr-4 text-right">{formatTry(y.dijivizit)}</td>
                      <td className="py-2.5 text-right">
                        {d === 0
                          ? "Eşit"
                          : d > 0
                            ? `Dijivizit ${formatTry(d)} ucuz`
                            : `Kâğıt ${formatTry(-d)} ucuz`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              Her bilgi değişikliğinde elde kalan kâğıt kartlar kullanılamaz ve yeni{" "}
              {PAPER_PACK_SIZE.toLocaleString("tr-TR")} adet bastırılır. Değişiklik yoksa artan
              kartlar sonraki yıla devreder.
            </li>
            {digital ? (
              <li>
                Kartsız dijital kartvizit yıllık {formatTry(PRICING.digitalYearlyFee)} olarak
                ödenir. {PRICING.bulkMinQuantity} kişi ve üzerinde ilk yıl %
                {PRICING.bulkDiscountPercent} indirimli; yenilemeleri liste fiyatından hesapladık.
              </li>
            ) : (
              <li>
                Kart tek seferlik ödenir
                {r.bulkDiscount
                  ? `, ${PRICING.bulkMinQuantity}+ kişide %${PRICING.bulkDiscountPercent} indirimle`
                  : ""}
                . Profil {FREE_PERIOD} ücretsiz, sonra kişi başı aylık{" "}
                {formatTry(PRICING.profileMonthlyFee)}; otomatik çekim yapılmaz.
              </li>
            )}
            <li>Tasarım, kargo ve kaybolan kart maliyetleri hesaba katılmadı.</li>
          </ul>
        </div>
      </div>

      <section className="grid gap-8 rounded-3xl bg-neutral-950 p-8 text-white sm:p-12 lg:grid-cols-[minmax(0,1.3fr)_auto] lg:items-center">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-white/60">Bir kez al, yıllarca güncelle</p>
          <h2 className="text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl">
            Bilgilerin değiştiğinde yeniden bastırma, profilini güncelle.
          </h2>
          <ul className="grid gap-2 text-white/80 sm:grid-cols-2">
            {digital ? (
              <>
                <li>Link ve QR kod; uygulama gerekmez</li>
                <li>{PROMISES.digitalDeliveryHours} saatte e-postanda</li>
                <li>İstediğinde NFC karta geç, link aynı kalır</li>
              </>
            ) : (
              <>
                <li>NFC çip ve QR kod; uygulama gerekmez</li>
                <li>Kargo ücretsiz, {PROMISES.deliveryHours} saatte teslim</li>
                <li>Okunmazsa ücretsiz değişim</li>
              </>
            )}
            <li>
              {PRICING.bulkMinQuantity}+ kişide %{PRICING.bulkDiscountPercent} indirim
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-start gap-3 lg:items-end">
          <p className="text-4xl font-semibold tracking-tight">{formatPrice(finish)}</p>
          <p className="text-sm text-white/60">{finish.name}</p>
          <Link
            href={`/kartvizit/${finish.slug}`}
            onClick={() => trackTool(TOOL, "tool_offer_click")}
            className="mt-2 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-base font-medium text-neutral-950 transition-colors hover:bg-white/90 focus-visible:ring-[3px] focus-visible:ring-white/60 focus-visible:outline-none"
          >
            Kartı incele
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
