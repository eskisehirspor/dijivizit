import { describe, expect, it } from "vitest";

import { buildOrderConfirmationEmail, buildOrderNotificationEmail } from "@/lib/email/order";
import { normalizeTurkishPhone, orderRequestSchema } from "@/lib/orders/validation";

const valid = {
  finish: "gold",
  quantity: "25",
  fullName: "Ayşe Demir",
  phone: "0540 626 19 65",
  email: "ayse@example.com",
  note: "",
  consent: "on",
};

describe("normalizeTurkishPhone", () => {
  it.each([
    ["0540 626 19 65", "+905406261965"],
    ["+90 540 626 1965", "+905406261965"],
    ["5406261965", "+905406261965"],
    ["(0222) 333 44 55", "+902223334455"],
  ])("%s -> %s", (input, expected) => {
    expect(normalizeTurkishPhone(input)).toBe(expected);
  });

  it.each(["123", "0540 626 19", "+1 415 555 0100", "0640 626 19 65"])("rejects %s", (input) => {
    expect(normalizeTurkishPhone(input)).toBeNull();
  });
});

describe("orderRequestSchema", () => {
  it("accepts a complete request and normalises it", () => {
    const parsed = orderRequestSchema.parse(valid);
    expect(parsed).toMatchObject({ finish: "gold", quantity: 25, phone: "+905406261965" });
  });

  it("requires a known finish, consent, a full name and a valid email", () => {
    const result = orderRequestSchema.safeParse({
      ...valid,
      finish: "plastic",
      consent: undefined,
      fullName: "Ayşe",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    const paths = result.error!.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["finish", "consent", "fullName", "email"]));
  });

  it("caps the quantity", () => {
    expect(orderRequestSchema.safeParse({ ...valid, quantity: "0" }).success).toBe(false);
    expect(orderRequestSchema.safeParse({ ...valid, quantity: "5000" }).success).toBe(false);
  });
});

describe("order emails", () => {
  const order = orderRequestSchema.parse({ ...valid, note: "<b>logo</b>\nikinci satır" });

  it("notification names the finish, escapes the note and formats the phone", () => {
    const email = buildOrderNotificationEmail(order, {
      receivedAt: "24 Ekim 2026 13:30",
      assetOrigin: "https://dijivizit.com",
    });
    expect(email.subject).toBe("Yeni sipariş talebi: Ayşe Demir · Gold × 25");
    expect(email.html).toContain("&lt;b&gt;logo&lt;/b&gt;<br>ikinci satır");
    expect(email.html).not.toContain("<b>logo</b>");
    expect(email.text).toContain("Telefon: 0540 626 19 65");
  });

  it("confirmation greets by first name", () => {
    const email = buildOrderConfirmationEmail(order, { assetOrigin: "https://dijivizit.com" });
    expect(email.html).toContain("Teşekkürler Ayşe");
    expect(email.text).toContain("Kaplama: Gold");
  });
});
