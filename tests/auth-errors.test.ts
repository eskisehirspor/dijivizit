import { describe, expect, it } from "vitest";

import { pageErrorKey } from "@/lib/auth/errors";

describe("pageErrorKey", () => {
  it("returns null when the param is absent", () => {
    expect(pageErrorKey(null)).toBeNull();
    expect(pageErrorKey(undefined)).toBeNull();
    expect(pageErrorKey("")).toBeNull();
  });

  it("maps known tokens onto their message keys", () => {
    expect(pageErrorKey("oauth")).toBe("auth.errors.oauthFailed");
    expect(pageErrorKey("confirm")).toBe("auth.errors.confirmFailed");
  });

  it("collapses unknown tokens to the generic message", () => {
    expect(pageErrorKey("anything-else")).toBe("auth.errors.unknown");
  });
});
