import { describe, expect, it } from "vitest";

import { displayValueForPublicLink } from "@/lib/profile/link-display";

describe("displayValueForPublicLink", () => {
  it("returns phone and email as stored", () => {
    expect(displayValueForPublicLink("phone", "+90 532 000 00 00")).toBe("+90 532 000 00 00");
    expect(displayValueForPublicLink("email", "ornek@sirket.com")).toBe("ornek@sirket.com");
  });

  it("extracts social usernames", () => {
    expect(displayValueForPublicLink("instagram", "https://www.instagram.com/gorkem")).toBe(
      "@gorkem",
    );
    expect(displayValueForPublicLink("x", "https://x.com/gorkem")).toBe("@gorkem");
    expect(displayValueForPublicLink("linkedin", "https://www.linkedin.com/in/gorkem-sonmez")).toBe(
      "gorkem-sonmez",
    );
  });

  it("extracts website hostnames without www", () => {
    expect(displayValueForPublicLink("website", "https://www.ornek.com/path")).toBe("ornek.com");
  });

  it("extracts WhatsApp numbers from wa.me URLs", () => {
    expect(displayValueForPublicLink("whatsapp", "https://wa.me/905320000000")).toBe(
      "+905320000000",
    );
  });
});
