import { describe, expect, it } from "vitest";

import { compareCardCosts, type CostInput } from "@/lib/marketing/card-cost";
import { FINISHES, PRICING } from "@/lib/orders/finishes";

const pvc = FINISHES.find((f) => f.id === "pvc-black")!.price;
const metal = FINISHES.find((f) => f.id === "black")!.price;
const yearlyProfile = Math.round(PRICING.profileMonthlyFee * 12 * 100) / 100;

const base: CostInput = {
  people: 1,
  cardsPerPersonPerYear: 200,
  paperPackPrice: 1500,
  reprintsPerYear: 0,
  years: 1,
  option: "pvc-black",
};

describe("card cost calculator", () => {
  it("carries leftover paper cards over when nothing changes", () => {
    const r = compareCardCosts({ ...base, years: 5 });
    // 1000 cards cover 5 years of 200.
    expect(r.paperPacksPerPerson).toBe(1);
    expect(r.paperTotal).toBe(1500);
  });

  it("reprints a pack every time the details change", () => {
    const r = compareCardCosts({ ...base, reprintsPerYear: 1, years: 3 });
    // First print plus one reprint for each of the 3 changes.
    expect(r.paperPacksPerPerson).toBe(4);
    expect(r.paperTotal).toBe(6000);
  });

  it("costs nothing on paper when no cards are handed out", () => {
    expect(compareCardCosts({ ...base, cardsPerPersonPerYear: 0, years: 3 }).paperTotal).toBe(0);
  });

  it("charges the card once and the profile after the free year", () => {
    const r = compareCardCosts({ ...base, years: 3 });
    expect(r.cardTotal).toBe(pvc);
    expect(r.subscriptionTotal).toBeCloseTo(yearlyProfile * (3 - PRICING.profileFreeYears), 2);
    expect(r.byYear[0]!.dijivizit).toBe(pvc);
  });

  it("applies the bulk discount from the threshold", () => {
    const r = compareCardCosts({ ...base, people: PRICING.bulkMinQuantity, option: "black" });
    expect(r.bulkDiscount).toBe(true);
    expect(r.cardTotal).toBe(
      metal * (1 - PRICING.bulkDiscountPercent / 100) * PRICING.bulkMinQuantity,
    );
  });

  it("bills card-less yearly, discount on the first order only", () => {
    const r = compareCardCosts({ ...base, people: 10, years: 2, option: "digital" });
    const first = PRICING.digitalYearlyFee * 10 * (1 - PRICING.bulkDiscountPercent / 100);
    expect(r.cardTotal).toBe(0);
    expect(r.dijivizitTotal).toBeCloseTo(first + PRICING.digitalYearlyFee * 10, 2);
  });

  it("reports when paper stays cheaper", () => {
    const r = compareCardCosts({ ...base, years: 1 });
    expect(r.breakEvenYear).toBeNull();
    const heavy = compareCardCosts({ ...base, reprintsPerYear: 2, years: 1 });
    expect(heavy.paperTotal).toBe(4500);
    expect(heavy.breakEvenYear).toBe(1);
  });

  it("clamps out-of-range input", () => {
    const r = compareCardCosts({ ...base, years: 99, people: -3 });
    expect(r.byYear).toHaveLength(5);
    expect(r.cardTotal).toBe(pvc);
  });
});
