import { describe, expect, it } from "vitest";

import { formatFileSize } from "@/lib/profile/documents";
import { validateDocumentFile } from "@/lib/validations/documents";

describe("validateDocumentFile", () => {
  it("accepts a PDF within the size limit", () => {
    expect(
      validateDocumentFile({ type: "application/pdf", size: 1024, name: "belge.pdf" }),
    ).toEqual({
      ok: true,
      mime: "application/pdf",
    });
  });

  it("rejects non-PDF types", () => {
    expect(validateDocumentFile({ type: "image/png", size: 1024, name: "belge.png" })).toEqual({
      ok: false,
      code: "type",
    });
  });

  it("rejects oversized files", () => {
    expect(
      validateDocumentFile({ type: "application/pdf", size: 11_000_000, name: "belge.pdf" }),
    ).toEqual({
      ok: false,
      code: "size",
    });
  });
});

describe("formatFileSize", () => {
  it("formats bytes, KB, and MB", () => {
    expect(formatFileSize(500)).toBe("500 B");
    expect(formatFileSize(2048)).toBe("2.0 KB");
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5.0 MB");
  });
});
