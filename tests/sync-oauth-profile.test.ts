import { describe, expect, it } from "vitest";

import { avatarUrlFromUserMetadata, fullNameFromUserMetadata } from "@/lib/auth/oauth-metadata";

describe("fullNameFromUserMetadata", () => {
  it("prefers full_name over name", () => {
    expect(fullNameFromUserMetadata({ full_name: "Görkem Sönmez", name: "Other" })).toBe(
      "Görkem Sönmez",
    );
  });

  it("falls back to name", () => {
    expect(fullNameFromUserMetadata({ name: "Görkem" })).toBe("Görkem");
  });

  it("returns null when missing", () => {
    expect(fullNameFromUserMetadata({})).toBeNull();
    expect(fullNameFromUserMetadata(undefined)).toBeNull();
  });
});

describe("avatarUrlFromUserMetadata", () => {
  it("prefers picture over avatar_url", () => {
    expect(
      avatarUrlFromUserMetadata({
        picture: "https://lh3.googleusercontent.com/a/pic",
        avatar_url: "https://example.com/other.png",
      }),
    ).toBe("https://lh3.googleusercontent.com/a/pic");
  });

  it("falls back to avatar_url", () => {
    expect(avatarUrlFromUserMetadata({ avatar_url: "https://example.com/a.png" })).toBe(
      "https://example.com/a.png",
    );
  });
});
