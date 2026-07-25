import { describe, expect, it } from "vitest";

import { loginSchema, passwordSchema, registerSchema } from "@/lib/validations/auth";

describe("passwordSchema", () => {
  it("requires at least 8 characters", () => {
    expect(passwordSchema.safeParse("short12").success).toBe(false);
    expect(passwordSchema.safeParse("longenough1").success).toBe(true);
  });

  it("caps length at bcrypt's 72-byte limit", () => {
    expect(passwordSchema.safeParse("a".repeat(72)).success).toBe(true);
    expect(passwordSchema.safeParse("a".repeat(73)).success).toBe(false);
  });

  it("reports failures as i18n keys rather than prose", () => {
    const result = passwordSchema.safeParse("nope");
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("validation.password.tooShort");
  });
});

describe("loginSchema", () => {
  it("accepts a well-formed credential pair", () => {
    const result = loginSchema.safeParse({ email: "a@b.com", password: "x" });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "x" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("validation.email.invalid");
  });

  it("reports empty email and password as required field errors", () => {
    const result = loginSchema.safeParse({ email: "", password: "" });
    expect(result.success).toBe(false);

    const messages = result.error?.issues.map((issue) => issue.message) ?? [];
    expect(messages).toContain("validation.email.required");
    expect(messages).toContain("validation.password.required");
  });
});

describe("registerSchema", () => {
  it("trims the display name", () => {
    const result = registerSchema.safeParse({
      fullName: "  Görkem Sönmez  ",
      email: "a@b.com",
      password: "longenough1",
    });

    expect(result.success).toBe(true);
    expect(result.data?.fullName).toBe("Görkem Sönmez");
  });

  it("rejects a one-character name", () => {
    const result = registerSchema.safeParse({
      fullName: "A",
      email: "a@b.com",
      password: "longenough1",
    });

    expect(result.success).toBe(false);
  });
});
