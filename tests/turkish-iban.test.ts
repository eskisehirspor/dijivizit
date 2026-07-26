import { describe, expect, it } from "vitest";

import {
  detectTurkishBankName,
  formatIbanDisplay,
  normalizeIban,
  turkishBankCodeFromIban,
} from "@/lib/bank/turkish-iban";
import { bankAccountSchema } from "@/lib/validations/bank-account";

describe("normalizeIban", () => {
  it("strips spaces and uppercases", () => {
    expect(normalizeIban("tr33 0006 1005 1978 6457 8413 26")).toBe("TR330006100519786457841326");
  });
});

describe("turkishBankCodeFromIban", () => {
  it("reads the 5-digit bank code from a TR IBAN", () => {
    expect(turkishBankCodeFromIban("TR330006100519786457841326")).toBe("00061");
    expect(turkishBankCodeFromIban("TR64 0006 4000 0012 3456 7890 12")).toBe("00064");
  });
});

describe("detectTurkishBankName", () => {
  it("detects İş Bankası from bank code 00064", () => {
    expect(detectTurkishBankName("TR640006400000123456789012")).toBe("İş Bankası");
  });

  it("detects Garanti BBVA from bank code 00062", () => {
    expect(detectTurkishBankName("TR620006200000123456789012")).toBe("Garanti BBVA");
  });

  it("returns null for unknown codes", () => {
    expect(detectTurkishBankName("TR880088800000123456789012")).toBeNull();
  });
});

describe("formatIbanDisplay", () => {
  it("groups into blocks of four", () => {
    expect(formatIbanDisplay("TR640006400000123456789012")).toBe(
      "TR64 0006 4000 0012 3456 7890 12",
    );
  });
});

describe("bankAccountSchema", () => {
  it("accepts a TR IBAN and fills bank name from detection", () => {
    const result = bankAccountSchema.safeParse({
      accountHolder: "Görkem Sönmez",
      iban: "TR64 0006 4000 0012 3456 7890 12",
      bankName: "",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      accountHolder: "Görkem Sönmez",
      iban: "TR640006400000123456789012",
      bankName: "İş Bankası",
    });
  });

  it("requires manual bank name when detection fails", () => {
    const result = bankAccountSchema.safeParse({
      accountHolder: "Görkem Sönmez",
      iban: "DE89370400440532013000",
      bankName: "",
    });

    expect(result.success).toBe(false);
  });

  it("accepts manual bank name when IBAN is valid but unknown", () => {
    const result = bankAccountSchema.safeParse({
      accountHolder: "Görkem Sönmez",
      iban: "DE89370400440532013000",
      bankName: "Deutsche Bank",
    });

    expect(result.success).toBe(true);
    expect(result.data?.bankName).toBe("Deutsche Bank");
  });
});
