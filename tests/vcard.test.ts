import { describe, expect, it } from "vitest";

import { vcardInputFromPublicCard, withResolvedPhoneLink } from "@/lib/share/vcard-from-card";
import {
  buildVcard30,
  escapeVcardValue,
  normalizeVcardAddress,
  vcardFilename,
} from "@/lib/share/vcard";
import type { PublicCard } from "@/lib/validations/card";

describe("escapeVcardValue", () => {
  it("escapes backslash, comma, semicolon, and newlines", () => {
    expect(escapeVcardValue("a\\b,c;d\ne")).toBe("a\\\\b\\,c\\;d\\ne");
  });
});

describe("buildVcard30", () => {
  it("includes every available contact field and omits empty ones", () => {
    const vcard = buildVcard30({
      fullName: "Görkem Sönmez",
      title: "Ürün Tasarımcısı",
      company: "Dijivizit",
      phone: "+905551112233",
      email: "hello@dijivizit.com",
      website: "https://dijivizit.com",
      linkedin: "https://www.linkedin.com/in/gorkem",
      instagram: "https://www.instagram.com/gorkem",
      x: "https://x.com/gorkem",
      facebook: "https://www.facebook.com/gorkem",
      whatsapp: "https://wa.me/905551112233",
      address: "İstanbul, Türkiye",
      publicUrl: "https://dijivizit.com/p/AbCdEfGh123",
    });

    expect(vcard.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n")).toBe(true);
    expect(vcard).toContain("FN;CHARSET=UTF-8:Görkem Sönmez");
    expect(vcard).toContain("N;CHARSET=UTF-8:Sönmez;Görkem;;;");
    expect(vcard).toContain("ORG;CHARSET=UTF-8:Dijivizit");
    expect(vcard).toContain("TITLE;CHARSET=UTF-8:Ürün Tasarımcısı");
    expect(vcard).toContain("TEL;TYPE=CELL,VOICE:+905551112233");
    expect(vcard).toContain("EMAIL;TYPE=INTERNET:hello@dijivizit.com");
    expect(vcard).toContain("ADR;TYPE=WORK;CHARSET=UTF-8:;;İstanbul\\, Türkiye;;;;");
    expect(vcard).toContain("item1.URL;type=pref:https://dijivizit.com");
    expect(vcard).toContain("item1.X-ABLabel:Website");
    expect(vcard).toContain("item2.X-ABLabel:LinkedIn");
    expect(vcard).toContain("item3.X-ABLabel:Instagram");
    expect(vcard).toContain("item4.X-ABLabel:X");
    expect(vcard).toContain("item5.X-ABLabel:Facebook");
    expect(vcard).toContain("item6.X-ABLabel:WhatsApp");
    expect(vcard).toContain("item7.X-ABLabel:Dijivizit");
    expect(vcard.endsWith("END:VCARD\r\n")).toBe(true);
  });

  it("flattens multiline addresses into a single ADR street line for maps", () => {
    const vcard = buildVcard30({
      fullName: "Görkem Sönmez",
      address: "Osmangazi Mah. Basın Şehitleri Cad. No:\n174/1 Odunpazarı/ESKİŞEHİR",
    });

    expect(vcard).toContain(
      "ADR;TYPE=WORK;CHARSET=UTF-8:;;Osmangazi Mah. Basın Şehitleri Cad. No: 174/1 Odunpazarı/ESKİŞEHİR;;;;",
    );
    expect(vcard).not.toMatch(/ADR;TYPE=WORK;CHARSET=UTF-8:;;.*\\n/);
  });

  it("omits ADR when address is empty or whitespace", () => {
    expect(buildVcard30({ fullName: "Ada", address: "   " })).not.toContain("ADR");
    expect(buildVcard30({ fullName: "Ada", address: "\n\n" })).not.toContain("ADR");
    expect(buildVcard30({ fullName: "Ada" })).not.toContain("ADR");
  });

  it("omits missing optional fields", () => {
    const vcard = buildVcard30({
      fullName: "Ada",
      publicUrl: "https://example.com/p/xxxxxxxxxxx",
    });

    expect(vcard).toContain("FN;CHARSET=UTF-8:Ada");
    expect(vcard).toContain("N;CHARSET=UTF-8:;Ada;;;");
    expect(vcard).not.toContain("TITLE");
    expect(vcard).not.toContain("ORG");
    expect(vcard).not.toContain("TEL");
    expect(vcard).not.toContain("EMAIL");
    expect(vcard).not.toContain("ADR");
    expect(vcard).toContain("item1.X-ABLabel:Dijivizit");
    expect(vcard).not.toContain("LinkedIn");
  });
});

describe("normalizeVcardAddress", () => {
  it("joins address lines into one searchable street value", () => {
    expect(
      normalizeVcardAddress("Osmangazi Mah. Basın Şehitleri Cad. No:\n174/1 Odunpazarı/ESKİŞEHİR"),
    ).toBe("Osmangazi Mah. Basın Şehitleri Cad. No: 174/1 Odunpazarı/ESKİŞEHİR");
  });
});

describe("vcardInputFromPublicCard", () => {
  it("maps visible profile links into vCard input", () => {
    const card: PublicCard = {
      publicId: "AbCdEfGh123",
      fullName: "Görkem Sönmez",
      title: "Ürün Tasarımcısı",
      company: "Dijivizit",
      about: null,
      address: "Levent, İstanbul",
      avatarPath: null,
      theme: "light",
      locale: "tr",
      skillsSectionTitle: "expertise_areas",
      documents: [],
      links: [
        { platform: "phone", label: null, value: "+905551112233" },
        { platform: "email", label: null, value: "hello@dijivizit.com" },
        { platform: "website", label: null, value: "https://dijivizit.com" },
        { platform: "linkedin", label: null, value: "https://www.linkedin.com/in/gorkem" },
        { platform: "instagram", label: null, value: "https://www.instagram.com/gorkem" },
        { platform: "x", label: null, value: "https://x.com/gorkem" },
        { platform: "facebook", label: null, value: "https://www.facebook.com/gorkem" },
        { platform: "whatsapp", label: null, value: "https://wa.me/905551112233" },
      ],
      skills: [],
    };

    expect(vcardInputFromPublicCard(card, "https://dijivizit.com/p/AbCdEfGh123")).toMatchObject({
      fullName: "Görkem Sönmez",
      title: "Ürün Tasarımcısı",
      company: "Dijivizit",
      phone: "+905551112233",
      email: "hello@dijivizit.com",
      website: "https://dijivizit.com",
      linkedin: "https://www.linkedin.com/in/gorkem",
      instagram: "https://www.instagram.com/gorkem",
      x: "https://x.com/gorkem",
      facebook: "https://www.facebook.com/gorkem",
      whatsapp: "https://wa.me/905551112233",
      address: "Levent, İstanbul",
      publicUrl: "https://dijivizit.com/p/AbCdEfGh123",
    });
  });

  it("derives TEL from WhatsApp when no phone link exists", () => {
    const card: PublicCard = {
      publicId: "AbCdEfGh123",
      fullName: "Görkem Sönmez",
      title: null,
      company: null,
      about: null,
      address: null,
      avatarPath: null,
      theme: "light",
      locale: "tr",
      skillsSectionTitle: "expertise_areas",
      documents: [],
      links: [{ platform: "whatsapp", label: null, value: "https://wa.me/905423521515" }],
      skills: [],
    };

    expect(vcardInputFromPublicCard(card, "https://dijivizit.com/p/AbCdEfGh123").phone).toBe(
      "+905423521515",
    );
    expect(withResolvedPhoneLink(card.links)[0]).toEqual({
      platform: "phone",
      label: null,
      value: "+905423521515",
    });
  });
});

describe("vcardFilename", () => {
  it("slugifies the name and falls back when empty", () => {
    expect(vcardFilename("Görkem Sönmez")).toBe("gorkem-sonmez.vcf");
    expect(vcardFilename("  ")).toBe("dijivizit.vcf");
    expect(vcardFilename(null)).toBe("dijivizit.vcf");
  });
});

describe("buildVcard30 multiple values", () => {
  it("writes every phone, email and website with labels", () => {
    const vcard = buildVcard30({
      fullName: "Ayşe Demir",
      phones: [
        { value: "+905551112233", label: "Cep" },
        { value: "+902121112233", label: "İş" },
      ],
      emails: [{ value: "is@ornek.com", label: "İş" }, { value: "ben@ornek.com" }],
      websites: [
        { value: "https://ornek.com" },
        { value: "https://blog.ornek.com", label: "Blog" },
      ],
    });

    expect(vcard).toContain("item1.TEL;TYPE=CELL,VOICE:+905551112233");
    expect(vcard).toContain("item1.X-ABLabel:Cep");
    expect(vcard).toContain("item2.TEL;TYPE=VOICE:+902121112233");
    expect(vcard).toContain("item3.EMAIL;TYPE=INTERNET:is@ornek.com");
    expect(vcard).toContain("EMAIL;TYPE=INTERNET:ben@ornek.com");
    expect(vcard).toContain("X-ABLabel:Blog");
    expect(vcard.match(/^item\d+\.URL/gm)).toHaveLength(2);
  });
});
