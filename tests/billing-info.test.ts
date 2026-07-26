import { describe, expect, it } from "vitest";

import { billingInfoSchema, normalizeTaxNumber } from "@/lib/validations/billing-info";

describe("normalizeTaxNumber", () => {
  it("strips non-digits", () => {
    expect(normalizeTaxNumber("123 456 7890")).toBe("1234567890");
    expect(normalizeTaxNumber("123-456-78901")).toBe("12345678901");
  });
});

describe("billingInfoSchema", () => {
  it("accepts a valid VKN billing payload", () => {
    const result = billingInfoSchema.safeParse({
      companyTitle: "ASD Tasarım Ltd. Şti.",
      companyAddress: "Osmangazi Mah.\nOdunpazarı/ESKİŞEHİR",
      taxNumber: "1234567890",
      taxOffice: "Odunpazarı",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.taxNumber).toBe("1234567890");
      expect(result.data.companyAddress).toContain("Odunpazarı");
    }
  });

  it("rejects an invalid tax number", () => {
    const result = billingInfoSchema.safeParse({
      companyTitle: "ASD Tasarım",
      companyAddress: "Eskişehir",
      taxNumber: "123",
      taxOffice: "Odunpazarı",
    });

    expect(result.success).toBe(false);
  });
});
