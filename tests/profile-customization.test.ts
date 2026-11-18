import { describe, expect, it } from "vitest";

import { cardLocaleFromAcceptLanguage, messagesFor } from "@/lib/i18n/messages";
import { cardTheme, isCardThemeId } from "@/lib/profile/themes";
import { isValidVanitySlug, toVanitySlug } from "@/lib/profile/vanity";
import { productSchema } from "@/lib/validations/product";

describe("vanity slugs", () => {
  it("turns a Turkish name into a slug", () => {
    expect(toVanitySlug("Görkem Sönmez")).toBe("gorkem-sonmez");
    expect(toVanitySlug("  Çağrı Işık Ünal  ")).toBe("cagri-isik-unal");
    expect(toVanitySlug("ASD Tasarım Ltd. Şti.")).toBe("asd-tasarim-ltd-sti");
  });

  it("accepts only the shapes the database accepts", () => {
    expect(isValidVanitySlug("gorkem-sonmez")).toBe(true);
    expect(isValidVanitySlug("ab")).toBe(false);
    expect(isValidVanitySlug("abcdefghijk")).toBe(false); // 11 chars looks like a public id
    expect(isValidVanitySlug("-gorkem")).toBe(false);
    expect(isValidVanitySlug("gorkem--s")).toBe(false);
    expect(isValidVanitySlug("Gorkem")).toBe(false);
  });
});

describe("themes", () => {
  it("falls back to default for unknown ids", () => {
    expect(cardTheme("nope").id).toBe("default");
    expect(isCardThemeId("navy")).toBe(true);
    expect(isCardThemeId("nope")).toBe(false);
  });
});

describe("card locale", () => {
  it("uses Turkish unless the browser prefers another language", () => {
    expect(cardLocaleFromAcceptLanguage(null)).toBe("tr");
    expect(cardLocaleFromAcceptLanguage("tr-TR,tr;q=0.9,en;q=0.8")).toBe("tr");
    expect(cardLocaleFromAcceptLanguage("en-US,en;q=0.9")).toBe("en");
    expect(cardLocaleFromAcceptLanguage("de-DE,de;q=0.9")).toBe("en");
  });

  it("falls back to Turkish for keys English lacks", () => {
    const en = messagesFor("en") as { card: { saveContact: string }; dashboard: unknown };
    expect(en.card.saveContact).toBe("Save to Contacts");
    expect(en.dashboard).toBeTruthy();
  });
});

describe("product input", () => {
  it("normalises optional fields and adds https", () => {
    const parsed = productSchema.parse({
      title: " Logo tasarımı ",
      description: "",
      price: "1.500 TL",
      url: "ornek.com/logo",
      imagePath: "",
    });
    expect(parsed).toEqual({
      title: "Logo tasarımı",
      description: null,
      price: "1.500 TL",
      url: "https://ornek.com/logo",
      imagePath: null,
    });
  });

  it("rejects an empty title", () => {
    expect(
      productSchema.safeParse({ title: " ", description: "", price: "", url: "", imagePath: "" })
        .success,
    ).toBe(false);
  });
});
