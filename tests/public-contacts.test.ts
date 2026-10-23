import { describe, expect, it } from "vitest";

import { visiblePublicContactLinks } from "@/lib/profile/public-contacts";

describe("visiblePublicContactLinks", () => {
  const publicUrl = "https://dijivizit.com/p/AbCdEfGh123";

  it("keeps real contact methods and resolves phone from WhatsApp", () => {
    const links = visiblePublicContactLinks(
      [
        { platform: "whatsapp", label: null, value: "https://wa.me/905423521515" },
        { platform: "email", label: null, value: "hello@dijivizit.com" },
        { platform: "website", label: null, value: "https://ornek.com" },
        { platform: "linkedin", label: null, value: "https://www.linkedin.com/in/gorkem" },
        { platform: "instagram", label: null, value: "https://www.instagram.com/gorkem" },
        { platform: "x", label: null, value: "https://x.com/gorkem" },
      ],
      publicUrl,
    );

    expect(links.map((link) => link.platform)).toEqual([
      "phone",
      "whatsapp",
      "email",
      "website",
      "linkedin",
      "instagram",
      "x",
    ]);
  });

  it("keeps the owner's ordering instead of a fixed platform order", () => {
    const links = visiblePublicContactLinks(
      [
        { platform: "linkedin", label: null, value: "https://www.linkedin.com/in/gorkem" },
        { platform: "email", label: "İş", value: "is@ornek.com" },
        { platform: "phone", label: "Cep", value: "+905555555555" },
        { platform: "email", label: "Kişisel", value: "ben@ornek.com" },
      ],
      publicUrl,
    );

    expect(links.map((link) => link.label ?? link.platform)).toEqual([
      "linkedin",
      "İş",
      "Cep",
      "Kişisel",
    ]);
  });

  it("inserts a profile address among contact methods", () => {
    const links = visiblePublicContactLinks(
      [
        { platform: "email", label: null, value: "hello@dijivizit.com" },
        { platform: "linkedin", label: null, value: "https://www.linkedin.com/in/gorkem" },
      ],
      publicUrl,
      "Levent, İstanbul",
    );

    expect(links.map((link) => link.platform)).toEqual(["email", "address", "linkedin"]);
    expect(links.find((link) => link.platform === "address")?.value).toBe("Levent, İstanbul");
  });

  it("excludes the public profile URL even when stored as website", () => {
    const links = visiblePublicContactLinks(
      [
        { platform: "website", label: null, value: publicUrl },
        { platform: "email", label: null, value: "hello@dijivizit.com" },
      ],
      publicUrl,
    );

    expect(links).toEqual([{ platform: "email", label: null, value: "hello@dijivizit.com" }]);
  });
});
