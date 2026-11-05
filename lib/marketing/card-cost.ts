import { FINISHES, PRICING, orderTotal, type Finish } from "@/lib/orders/finishes";

/**
 * Paper vs Dijivizit business card cost over a few years, for the free
 * calculator at /kartvizit-maliyet-hesaplama. Pure, so it is unit tested.
 */

/** Cards in one print pack: the price the visitor enters is for this many. */
export const PAPER_PACK_SIZE = 1000;

/** Default paper price per pack, in TRY. The visitor overrides it with their printer's quote. */
export const DEFAULT_PAPER_PACK_PRICE = 1500;

export const COST_YEARS_MAX = 5;

/** "ilk yıl" / "ilk 2 yıl": the profile's free period, in words. */
export const FREE_PERIOD =
  PRICING.profileFreeYears === 1 ? "ilk yıl" : `ilk ${PRICING.profileFreeYears} yıl`;

/** Card types the calculator offers, one per price group, read from FINISHES. */
export const COST_OPTIONS = [
  { id: "pvc-black", label: "Siyah mat PVC" },
  { id: "wood", label: "Ahşap" },
  { id: "black", label: "Metal" },
  { id: "digital", label: "Kartsız (link + QR)" },
] as const;

export type CostOptionId = (typeof COST_OPTIONS)[number]["id"];

export function costFinish(id: CostOptionId): Finish {
  return FINISHES.find((f) => f.id === id)!;
}

export type CostInput = {
  /** People who carry a card. */
  people: number;
  /** Cards each person hands out in a year. */
  cardsPerPersonPerYear: number;
  /** Price of one pack of PAPER_PACK_SIZE paper cards, TRY. */
  paperPackPrice: number;
  /** How many times a year the details change and the cards are reprinted. */
  reprintsPerYear: number;
  /** Years to compare, 1..COST_YEARS_MAX. */
  years: number;
  option: CostOptionId;
};

export type CostYear = {
  year: number;
  /** Cumulative totals up to the end of this year, TRY. */
  paper: number;
  dijivizit: number;
};

export type CostResult = {
  /** Paper packs printed per person over the whole period. */
  paperPacksPerPerson: number;
  paperTotal: number;
  /** One-off card cost for everyone, after the bulk discount (0 for card-less). */
  cardTotal: number;
  /** Profile or card-less subscription fees for everyone over the period. */
  subscriptionTotal: number;
  dijivizitTotal: number;
  bulkDiscount: boolean;
  byYear: CostYear[];
  /** First year in which Dijivizit's running total is at or below paper's; null if never. */
  breakEvenYear: number | null;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.floor(n)));
}

/** Packs one person prints by the end of each year (cumulative). */
function paperPacksByYear(cardsPerYear: number, reprintsPerYear: number, years: number): number[] {
  const out: number[] = [];
  // Each year is split into (changes + 1) equal stretches. When the details
  // change, the cards still in the box are thrown away and a new pack is
  // printed. Without changes, leftover cards carry over to the next year.
  const segments = reprintsPerYear + 1;
  const demand = cardsPerYear / segments;
  let stock = 0;
  let packs = 0;
  for (let y = 1; y <= years; y++) {
    for (let s = 0; s < segments; s++) {
      if (s > 0) stock = 0;
      if (demand > 0 && stock < demand) {
        const buy = Math.ceil((demand - stock) / PAPER_PACK_SIZE);
        packs += buy;
        stock += buy * PAPER_PACK_SIZE;
      }
      stock -= demand;
    }
    out.push(packs);
  }
  return out;
}

export function normalizeCostInput(input: CostInput): CostInput {
  return {
    people: clampInt(input.people, 1, 10000),
    cardsPerPersonPerYear: clampInt(input.cardsPerPersonPerYear, 0, 100000),
    paperPackPrice: Number.isFinite(input.paperPackPrice) ? Math.max(0, input.paperPackPrice) : 0,
    reprintsPerYear: clampInt(input.reprintsPerYear, 0, 12),
    years: clampInt(input.years, 1, COST_YEARS_MAX),
    option: input.option,
  };
}

export function compareCardCosts(raw: CostInput): CostResult {
  const input = normalizeCostInput(raw);
  const { people, years } = input;
  const finish = costFinish(input.option);
  const bulkDiscount = people >= PRICING.bulkMinQuantity;
  const digital = finish.material === "digital";

  const packs = paperPacksByYear(input.cardsPerPersonPerYear, input.reprintsPerYear, years);

  // Cards: one-off, bulk discount from orderTotal. Card-less: the first year is
  // ordered like a card (bulk discount applies); renewals are counted at list
  // price because we do not assume a renewal discount.
  const cardTotal = digital ? 0 : orderTotal(finish, people);
  const firstYearDigital = digital ? orderTotal(finish, people) : 0;
  const yearlyFeePerPerson = digital
    ? PRICING.digitalYearlyFee
    : round2(PRICING.profileMonthlyFee * 12);

  const byYear: CostYear[] = [];
  let subscription = 0;
  for (let y = 1; y <= years; y++) {
    if (digital) {
      subscription += y === 1 ? firstYearDigital : yearlyFeePerPerson * people;
    } else if (y > PRICING.profileFreeYears) {
      subscription += yearlyFeePerPerson * people;
    }
    byYear.push({
      year: y,
      paper: round2(packs[y - 1]! * input.paperPackPrice * people),
      dijivizit: round2(cardTotal + subscription),
    });
  }

  const last = byYear.at(-1)!;
  const breakEven = byYear.find((r) => r.dijivizit <= r.paper);

  return {
    paperPacksPerPerson: packs.at(-1)!,
    paperTotal: last.paper,
    cardTotal: round2(cardTotal),
    subscriptionTotal: round2(subscription),
    dijivizitTotal: last.dijivizit,
    bulkDiscount,
    byYear,
    breakEvenYear: breakEven ? breakEven.year : null,
  };
}
