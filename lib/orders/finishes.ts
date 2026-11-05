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
    note: "Koyu ahşap, lazerle yakılmış logo.",
    slug: "koyu-ahsap",
    name: "Koyu Ahşap NFC Kartvizit",
    material: "wood",
    price: 2500,
  },
  {
    id: "wood-light",
    label: "Açık ahşap",
    note: "Açık ahşap, lazerle yakılmış logo.",
    slug: "acik-ahsap",
    name: "Açık Ahşap NFC Kartvizit",
    material: "wood",
    price: 2500,
  },
  {
    id: "pvc-black",
    label: "Siyah mat PVC",
    note: "Mat siyah PVC, kadife dokulu yüzey.",
    slug: "siyah-mat-pvc",
    name: "Siyah Mat PVC NFC Kartvizit",
    material: "pvc",
    price: 2500,
  },
  {
    id: "digital",
    label: "Dijital (kartsız)",
    note: "Fiziksel kart yok: profil linki ve QR kod. Mesajla, e-posta imzasında, sosyal medyada paylaşırsın.",
    slug: "dijital-kartvizit-qr",
    name: "Kartsız Dijital Kartvizit (Link + QR)",
    material: "digital",
    price: 59.9,
  },
] as const;

export type FinishId = (typeof FINISHES)[number]["id"];
export type Finish = (typeof FINISHES)[number];

export const FINISH_IDS = FINISHES.map((f) => f.id) as [FinishId, ...FinishId[]];

export function isFinishId(value: unknown): value is FinishId {
  return typeof value === "string" && (FINISH_IDS as readonly string[]).includes(value);
}

/** True for the card-less product: a monthly profile with a link and QR code. */
export function isDigital(finish: Finish): boolean {
  return finish.material === "digital";
}

/** Physical cards only, for pickers and renders that show a card. */
export const CARD_FINISHES = FINISHES.filter((f) => f.material !== "digital");

/** "4.000 TL" for cards, "50 TL/ay" for the monthly digital product. */
export function formatPrice(finish: Finish, amount: number = finish.price): string {
  return isDigital(finish) ? `${formatTry(amount)}/ay` : formatTry(amount);
}

/** Amount actually charged for one unit: the card price, or a year up front for digital. */
export function chargePerUnit(finish: Finish): number {
  return isDigital(finish) ? PRICING.digitalYearlyFee : finish.price;
}

/** Order total in TRY, after the bulk discount. */
export function orderTotal(finish: Finish, quantity: number): number {
  const discount = quantity >= PRICING.bulkMinQuantity ? PRICING.bulkDiscountPercent / 100 : 0;
  return Math.round(chargePerUnit(finish) * (1 - discount) * quantity * 100) / 100;
}

/** Product shape for analytics events. */
export function analyticsItem(finish: Finish) {
  return { id: finish.id, name: finish.name, price: chargePerUnit(finish) };
}

/** Promises shown across the site. */
export const PROMISES = {
  deliveryHours: 72,
  /** Card-less digital product: link and QR by e-mail. */
  digitalDeliveryHours: 2,
} as const;

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
  /** The card-less digital product is billed a year up front. */
  digitalYearlyFee: 718.8,
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
