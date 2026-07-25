import { describe, expect, it } from "vitest";

import { basicProfileSchema } from "@/lib/validations/profile";

describe("basicProfileSchema", () => {
  it("accepts a complete profile and trims the name", () => {
    const result = basicProfileSchema.safeParse({
      fullName: "  Görkem Sönmez  ",
      title: "Ürün Tasarımcısı",
      company: "Dijivizit",
      about: "Kısa bir giriş.",
    });

    expect(result.success).toBe(true);
    expect(result.data?.fullName).toBe("Görkem Sönmez");
  });

  it("requires a full name", () => {
    const result = basicProfileSchema.safeParse({
      fullName: "",
      title: "",
      company: "",
      about: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("validation.fullName.tooShort");
  });

  it("coerces blank optional fields to null", () => {
    const result = basicProfileSchema.safeParse({
      fullName: "Görkem Sönmez",
      title: "   ",
      company: "",
      about: "",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      fullName: "Görkem Sönmez",
      title: null,
      company: null,
      about: null,
    });
  });

  it("rejects an about field over 5000 characters", () => {
    const result = basicProfileSchema.safeParse({
      fullName: "Görkem Sönmez",
      title: "",
      company: "",
      about: "a".repeat(5001),
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("validation.about.tooLong");
  });
});
