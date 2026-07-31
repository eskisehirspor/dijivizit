import { describe, expect, it } from "vitest";

import {
  emailShareHref,
  telegramShareHref,
  whatsappShareHref,
} from "@/lib/share/public-share-links";

describe("public share links", () => {
  const url = "https://dijivizit.com/p/abcdefghijk";

  it("builds a WhatsApp share href", () => {
    expect(whatsappShareHref(url)).toBe(`https://wa.me/?text=${encodeURIComponent(url)}`);
  });

  it("builds a Telegram share href", () => {
    expect(telegramShareHref(url)).toBe(`https://t.me/share/url?url=${encodeURIComponent(url)}`);
  });

  it("builds a mailto share href with the given subject", () => {
    const href = emailShareHref(url, "Check out my digital business card");
    const query = new URLSearchParams(href.slice("mailto:?".length));

    expect(href.startsWith("mailto:?")).toBe(true);
    expect(query.get("subject")).toBe("Check out my digital business card");
    expect(query.get("body")).toBe(url);
  });
});
