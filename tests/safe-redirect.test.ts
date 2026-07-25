import { describe, expect, it } from "vitest";

import { safeRedirectPath } from "@/lib/utils/safe-redirect";

const FALLBACK = "/dashboard";

describe("safeRedirectPath", () => {
  it("keeps same-origin paths", () => {
    expect(safeRedirectPath("/settings", FALLBACK)).toBe("/settings");
    expect(safeRedirectPath("/p/A8fK29LmQx7", FALLBACK)).toBe("/p/A8fK29LmQx7");
  });

  it("falls back when nothing was supplied", () => {
    expect(safeRedirectPath(null, FALLBACK)).toBe(FALLBACK);
    expect(safeRedirectPath(undefined, FALLBACK)).toBe(FALLBACK);
    expect(safeRedirectPath("", FALLBACK)).toBe(FALLBACK);
  });

  it("rejects absolute URLs to other origins", () => {
    expect(safeRedirectPath("https://evil.example", FALLBACK)).toBe(FALLBACK);
    expect(safeRedirectPath("http://evil.example/path", FALLBACK)).toBe(FALLBACK);
  });

  it("rejects protocol-relative URLs", () => {
    expect(safeRedirectPath("//evil.example", FALLBACK)).toBe(FALLBACK);
    expect(safeRedirectPath("//evil.example/path", FALLBACK)).toBe(FALLBACK);
  });

  it("rejects non-http schemes", () => {
    expect(safeRedirectPath("javascript:alert(1)", FALLBACK)).toBe(FALLBACK);
    expect(safeRedirectPath("data:text/html,<script>", FALLBACK)).toBe(FALLBACK);
  });
});
