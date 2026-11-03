import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";

import { parseShopierOrder, verifyShopierSignature } from "@/lib/shopier/order";

const products = {
  black: { id: "111", url: "https://www.shopier.com/111" },
  digital: { id: "999", url: "https://www.shopier.com/999" },
};

describe("Shopier webhook", () => {
  it("accepts a correct HMAC-SHA256 hex signature and rejects others", async () => {
    const body = JSON.stringify({ id: "42" });
    const sig = createHmac("sha256", "tok").update(body).digest("hex");
    expect(await verifyShopierSignature(body, sig, "tok")).toBe(true);
    expect(await verifyShopierSignature(body, sig.toUpperCase(), "tok")).toBe(true);
    expect(await verifyShopierSignature(body, sig, "other")).toBe(false);
    expect(await verifyShopierSignature(body + " ", sig, "tok")).toBe(false);
    expect(await verifyShopierSignature(body, null, "tok")).toBe(false);
  });

  it("maps line items to finishes and detects the digital product", () => {
    const o = parseShopierOrder(
      {
        id: 42,
        totals: { total: "4718.80" },
        shippingInfo: { firstName: "Ayşe", lastName: "Demir", email: "AYSE@x.com", phone: "0532" },
        lineItems: [
          { productId: "111", title: "Siyah", quantity: 1, total: "4000.00", type: "physical" },
          { productId: "999", title: "Dijital", quantity: 1, total: "718.80", type: "digital" },
        ],
      },
      products,
    )!;
    expect(o.orderId).toBe("42");
    expect(o.fullName).toBe("Ayşe Demir");
    expect(o.email).toBe("ayse@x.com");
    expect(o.total).toBe(4718.8);
    expect(o.items.map((i) => i.finish)).toEqual(["black", "digital"]);
    expect(o.hasDigital).toBe(true);
  });

  it("rejects an order without an id", () => {
    expect(parseShopierOrder({ lineItems: [] }, products)).toBeNull();
  });
});
