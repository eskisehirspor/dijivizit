/** Card finishes offered on dijivizit.com, in display order. */
export const FINISHES = [
  {
    id: "black",
    label: "Siyah metal",
    note: "Mat siyah metal, açık gri lazer kazıma.",
    slug: "siyah-metal",
    name: "Siyah Metal NFC Kartvizit",
    material: "metal",
    price: 4000,
  },
  {
    id: "silver",
    label: "Gümüş",
    note: "Mat fırçalanmış gümüş, koyu lazer kazıma.",
    slug: "gumus-metal",
    name: "Gümüş Metal NFC Kartvizit",
    material: "metal",
    price: 4000,
  },
  {
    id: "gold",
    label: "Gold",
    note: "Mat fırçalanmış gold, koyu lazer kazıma.",
    slug: "gold-metal",
    name: "Gold Metal NFC Kartvizit",
    material: "metal",
    price: 4000,
  },
  {
    id: "wood",
    label: "Koyu ahşap",
    note: "Koyu ahşap, lazerle yakılmış yazı.",
    slug: "koyu-ahsap",
    name: "Koyu Ahşap NFC Kartvizit",
    material: "wood",
    price: 2500,
  },
  {
    id: "wood-light",
    label: "Açık ahşap",
    note: "Açık ahşap, lazerle yakılmış yazı.",
    slug: "acik-ahsap",
    name: "Açık Ahşap NFC Kartvizit",
    material: "wood",
    price: 2500,
  },
] as const;

export type FinishId = (typeof FINISHES)[number]["id"];
export type Finish = (typeof FINISHES)[number];

export const FINISH_IDS = FINISHES.map((f) => f.id) as [FinishId, ...FinishId[]];

export function isFinishId(value: unknown): value is FinishId {
  return typeof value === "string" && (FINISH_IDS as readonly string[]).includes(value);
}

export function finishLabel(id: FinishId): string {
  return FINISHES.find((f) => f.id === id)!.label;
}

export function getFinishBySlug(slug: string): Finish | undefined {
  return FINISHES.find((f) => f.slug === slug);
}

/** Pricing terms shown on the site. Prices are per card in TRY, VAT included. */
export const PRICING = {
  bulkMinQuantity: 10,
  bulkDiscountPercent: 20,
  freeShipping: true,
  profileFreeYears: 1,
  profileMonthlyFee: 59.9,
} as const;

/** Unit price after the bulk discount for the given quantity. */
export function unitPrice(finish: Finish, quantity: number): number {
  const discount = quantity >= PRICING.bulkMinQuantity ? PRICING.bulkDiscountPercent / 100 : 0;
  return Math.round(finish.price * (1 - discount) * 100) / 100;
}

/** "4.000 TL", "59,90 TL". */
export function formatTry(amount: number): string {
  const decimals = Number.isInteger(amount) ? 0 : 2;
  return `${amount.toLocaleString("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} TL`;
}
