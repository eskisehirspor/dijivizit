/** Card finishes offered on dijivizit.com, in display order. */
export const FINISHES = [
  { id: "black", label: "Siyah metal", note: "Mat siyah metal, açık gri lazer kazıma." },
  { id: "silver", label: "Gümüş", note: "Mat fırçalanmış gümüş, koyu lazer kazıma." },
  { id: "gold", label: "Gold", note: "Mat fırçalanmış gold, koyu lazer kazıma." },
  { id: "wood", label: "Koyu ahşap", note: "Koyu ahşap, lazerle yakılmış yazı." },
  { id: "wood-light", label: "Açık ahşap", note: "Açık ahşap, lazerle yakılmış yazı." },
] as const;

export type FinishId = (typeof FINISHES)[number]["id"];

export const FINISH_IDS = FINISHES.map((f) => f.id) as [FinishId, ...FinishId[]];

export function isFinishId(value: unknown): value is FinishId {
  return typeof value === "string" && (FINISH_IDS as readonly string[]).includes(value);
}

export function finishLabel(id: FinishId): string {
  return FINISHES.find((f) => f.id === id)!.label;
}
