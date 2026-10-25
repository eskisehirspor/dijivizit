import { describe, expect, it } from "vitest";

import {
  addDays,
  contactsToCsv,
  displayPhone,
  followUpMessage,
  whatsappHref,
} from "@/lib/contacts/format";
import {
  cardContactSchema,
  contactSchema,
  normalizeContactPhone,
  parseTags,
} from "@/lib/contacts/validation";

describe("contact phone", () => {
  it("normalises Turkish and international numbers", () => {
    expect(normalizeContactPhone("0540 626 19 65")).toBe("+905406261965");
    expect(normalizeContactPhone("+44 20 7946 0958")).toBe("+442079460958");
    expect(normalizeContactPhone("0049 30 123456")).toBe("+4930123456");
    expect(normalizeContactPhone("123")).toBeNull();
    expect(displayPhone("+905406261965")).toBe("0540 626 19 65");
  });
});

describe("card contact form", () => {
  const base = { fullName: "Ayşe Yılmaz", consent: "on" };

  it("needs a phone or an email", () => {
    expect(cardContactSchema.safeParse(base).success).toBe(false);
    expect(cardContactSchema.safeParse({ ...base, email: "AYSE@Example.com" }).data?.email).toBe(
      "ayse@example.com",
    );
  });

  it("needs consent", () => {
    expect(cardContactSchema.safeParse({ fullName: "Ayşe", phone: "05321112233" }).success).toBe(
      false,
    );
  });

  it("rejects a bad phone instead of dropping it", () => {
    const r = cardContactSchema.safeParse({ ...base, phone: "abc", email: "a@b.co" });
    expect(r.success).toBe(false);
  });
});

describe("manual contact", () => {
  it("parses tags", () => {
    expect(parseTags("Müşteri, #fuar,  müşteri ,")).toEqual(["müşteri", "fuar"]);
    expect(parseTags(Array.from({ length: 15 }, (_, i) => `t${i}`).join(","))).toHaveLength(10);
    const r = contactSchema.safeParse({ fullName: "Can Demir", phone: "5321112233", tags: "a,b" });
    expect(r.data?.tags).toEqual(["a", "b"]);
    expect(r.data?.company).toBeNull();
  });
});

describe("format helpers", () => {
  it("builds a WhatsApp link with the card URL", () => {
    const text = followUpMessage({
      contactName: "Ayşe Yılmaz",
      ownerName: "Görkem Sönmez",
      cardUrl: "https://app.dijivizit.com/p/abc",
    });
    expect(text).toContain("Merhaba Ayşe");
    const href = whatsappHref("+905321112233", text);
    expect(href).toMatch(/^https:\/\/wa\.me\/905321112233\?text=/);
    expect(whatsappHref(null, text)).toBeNull();
  });

  it("writes Excel-safe CSV", () => {
    const csv = contactsToCsv([
      {
        full_name: "=HYPERLINK(1)",
        phone: "+905321112233",
        email: null,
        company: 'A "B"; C',
        title: null,
        met_where: null,
        tags: ["x", "y"],
        message: "satır\niki",
        source: "card_form",
        created_at: "2026-10-25T10:00:00Z",
      },
    ]);
    expect(csv.startsWith("﻿")).toBe(true);
    const line = csv.split("\r\n")[1]!;
    expect(line.startsWith("'=HYPERLINK(1)")).toBe(true);
    expect(line).toContain("0532 111 22 33");
    expect(line).toContain('"A ""B""; C"');
    expect(line).toContain("Kart formu");
  });

  it("adds days across month ends", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
  });
});
