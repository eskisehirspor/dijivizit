import { describe, expect, it } from "vitest";

import { FINISHES, formatTry, getFinishBySlug, unitPrice } from "@/lib/orders/finishes";
import { productJsonLd } from "@/lib/marketing/products";

const black = FINISHES.find((f) => f.id === "black")!;
const wood = FINISHES.find((f) => f.id === "wood")!;

describe("finish pricing", () => {
  it("charges the list price below the bulk threshold", () => {
    expect(unitPrice(black, 1)).toBe(4000);
    expect(unitPrice(wood, 9)).toBe(2500);
  });

  it("applies the bulk discount from 10 cards", () => {
    expect(unitPrice(black, 10)).toBe(3200);
    expect(unitPrice(wood, 25)).toBe(2000);
  });

  it("formats Turkish lira", () => {
    expect(formatTry(4000)).toBe("4.000 TL");
    expect(formatTry(59.9)).toBe("59,90 TL");
  });

  it("finds finishes by product slug", () => {
    expect(getFinishBySlug("siyah-metal")?.id).toBe("black");
    expect(getFinishBySlug("yok")).toBeUndefined();
  });

  it("puts the list price in the product structured data", () => {
    const ld = productJsonLd(black);
    expect(ld.offers.price).toBe("4000.00");
    expect(ld.offers.priceCurrency).toBe("TRY");
  });
});
