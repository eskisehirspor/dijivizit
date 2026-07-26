import { describe, expect, it } from "vitest";

import { phoneFromWhatsappValue, resolvePhoneFromLinks } from "@/lib/profile/resolve-phone";

describe("phoneFromWhatsappValue", () => {
  it("extracts E.164 from wa.me URLs", () => {
    expect(phoneFromWhatsappValue("https://wa.me/905423521515")).toBe("+905423521515");
  });

  it("returns null for non-WhatsApp URLs", () => {
    expect(phoneFromWhatsappValue("https://dijivizit.com")).toBeNull();
  });
});

describe("resolvePhoneFromLinks", () => {
  it("prefers an explicit phone link", () => {
    expect(
      resolvePhoneFromLinks([
        { platform: "phone", value: "+905551112233" },
        { platform: "whatsapp", value: "https://wa.me/905423521515" },
      ]),
    ).toBe("+905551112233");
  });

  it("falls back to WhatsApp when phone is missing", () => {
    expect(
      resolvePhoneFromLinks([{ platform: "whatsapp", value: "https://wa.me/905423521515" }]),
    ).toBe("+905423521515");
  });
});
