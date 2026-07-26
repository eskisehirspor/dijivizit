import { describe, expect, it } from "vitest";

import { hrefForPublicLink } from "@/lib/profile/link-href";

describe("hrefForPublicLink", () => {
  it("builds tel links for phone", () => {
    expect(hrefForPublicLink("phone", "+90 532 000 00 00")).toBe("tel:+905320000000");
  });

  it("builds mailto links for email", () => {
    expect(hrefForPublicLink("email", "ornek@sirket.com")).toBe("mailto:ornek@sirket.com");
  });

  it("passes through https values for website and social", () => {
    expect(hrefForPublicLink("website", "https://ornek.com")).toBe("https://ornek.com");
    expect(hrefForPublicLink("instagram", "https://www.instagram.com/gorkem")).toBe(
      "https://www.instagram.com/gorkem",
    );
  });

  it("builds Google Maps search links for address", () => {
    expect(hrefForPublicLink("address", "Levent, İstanbul")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Levent%2C%20%C4%B0stanbul",
    );
  });
});
