import { describe, expect, it } from "vitest";

import {
  createProfileLinkSchema,
  extractUsername,
  normalizeLinkValue,
} from "@/lib/validations/profile-links";

describe("normalizeLinkValue", () => {
  it("accepts a phone number", () => {
    expect(normalizeLinkValue("phone", "+90 532 000 00 00")).toEqual({
      ok: true,
      value: "+905320000000",
    });
  });

  it("accepts phone numbers pasted with tel: or unicode spaces", () => {
    expect(normalizeLinkValue("phone", "tel:+90\u00a0532\u00a0000\u00a000\u00a000")).toEqual({
      ok: true,
      value: "+905320000000",
    });
  });

  it("normalises WhatsApp phone numbers to wa.me URLs", () => {
    expect(normalizeLinkValue("whatsapp", "+90 532 000 00 00")).toEqual({
      ok: true,
      value: "https://wa.me/905320000000",
    });
  });

  it("prefixes https for bare website hosts", () => {
    expect(normalizeLinkValue("website", "ornek.com")).toEqual({
      ok: true,
      value: "https://ornek.com",
    });
  });

  it("rejects javascript URLs", () => {
    expect(normalizeLinkValue("website", "javascript:alert(1)").ok).toBe(false);
  });

  it("builds Instagram URLs from usernames", () => {
    expect(normalizeLinkValue("instagram", "@gorkem")).toEqual({
      ok: true,
      value: "https://www.instagram.com/gorkem",
    });
  });

  it("builds LinkedIn URLs from usernames", () => {
    expect(normalizeLinkValue("linkedin", "gorkem-sonmez")).toEqual({
      ok: true,
      value: "https://www.linkedin.com/in/gorkem-sonmez",
    });
  });

  it("builds X URLs from usernames", () => {
    expect(normalizeLinkValue("x", "gorkem")).toEqual({
      ok: true,
      value: "https://x.com/gorkem",
    });
  });

  it("accepts a pasted Instagram URL and stores the canonical form", () => {
    expect(normalizeLinkValue("instagram", "https://www.instagram.com/gorkem/")).toEqual({
      ok: true,
      value: "https://www.instagram.com/gorkem",
    });
  });
});

describe("extractUsername", () => {
  it("extracts Instagram usernames from stored URLs", () => {
    expect(extractUsername("instagram", "https://www.instagram.com/gorkem")).toBe("gorkem");
  });

  it("extracts LinkedIn usernames from /in/ paths", () => {
    expect(extractUsername("linkedin", "https://www.linkedin.com/in/gorkem-sonmez")).toBe(
      "gorkem-sonmez",
    );
  });

  it("extracts X usernames from stored URLs", () => {
    expect(extractUsername("x", "https://x.com/gorkem")).toBe("gorkem");
  });
});

describe("createProfileLinkSchema", () => {
  it("accepts a LinkedIn username and stores the full URL", () => {
    const result = createProfileLinkSchema.safeParse({
      platform: "linkedin",
      value: "gorkem",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      platform: "linkedin",
      value: "https://www.linkedin.com/in/gorkem",
      label: null,
    });
  });

  it("rejects GitHub because it is outside the MVP picker", () => {
    const result = createProfileLinkSchema.safeParse({
      platform: "github",
      value: "https://github.com/gorkem",
    });

    expect(result.success).toBe(false);
  });

  it("rejects platforms outside the MVP picker", () => {
    const result = createProfileLinkSchema.safeParse({
      platform: "custom",
      value: "https://ornek.com",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty value", () => {
    const result = createProfileLinkSchema.safeParse({
      platform: "email",
      value: "  ",
    });

    expect(result.success).toBe(false);
  });
});
