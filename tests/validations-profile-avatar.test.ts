import { describe, expect, it } from "vitest";

import { AVATAR_MAX_BYTES } from "@/lib/profile/avatar";
import { validateAvatarFile } from "@/lib/validations/profile-avatar";

describe("validateAvatarFile", () => {
  it("accepts a jpeg under the size limit", () => {
    expect(validateAvatarFile({ type: "image/jpeg", size: 1024 })).toEqual({
      ok: true,
      mime: "image/jpeg",
    });
  });

  it("accepts png and webp", () => {
    expect(validateAvatarFile({ type: "image/png", size: 2048 }).ok).toBe(true);
    expect(validateAvatarFile({ type: "image/webp", size: 2048 }).ok).toBe(true);
  });

  it("rejects an empty file", () => {
    expect(validateAvatarFile({ type: "image/jpeg", size: 0 })).toEqual({
      ok: false,
      code: "empty",
    });
  });

  it("rejects disallowed mime types", () => {
    expect(validateAvatarFile({ type: "image/gif", size: 1024 })).toEqual({
      ok: false,
      code: "type",
    });
    expect(validateAvatarFile({ type: "application/pdf", size: 1024 })).toEqual({
      ok: false,
      code: "type",
    });
  });

  it("rejects files larger than 2 MiB", () => {
    expect(validateAvatarFile({ type: "image/png", size: AVATAR_MAX_BYTES + 1 })).toEqual({
      ok: false,
      code: "size",
    });
  });

  it("accepts a file exactly at the 2 MiB limit", () => {
    expect(validateAvatarFile({ type: "image/webp", size: AVATAR_MAX_BYTES })).toEqual({
      ok: true,
      mime: "image/webp",
    });
  });
});
