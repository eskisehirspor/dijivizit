import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/env/server", () => ({ serverEnv: { SUPABASE_SECRET_KEY: "test-secret" } }));

const { issueFormToken, verifyFormToken } = await import("@/lib/security/form-token");

describe("form token", () => {
  const t0 = 1_700_000_000_000;

  it("accepts a token after the minimum time on page", async () => {
    const token = await issueFormToken("order", t0);
    expect(await verifyFormToken(token, "order", t0 + 5_000)).toBe(true);
  });

  it("rejects instant submits and expired tokens", async () => {
    const token = await issueFormToken("order", t0);
    expect(await verifyFormToken(token, "order", t0 + 500)).toBe(false);
    expect(await verifyFormToken(token, "order", t0 + 7 * 60 * 60 * 1000)).toBe(false);
  });

  it("rejects another purpose and tampered timestamps", async () => {
    const token = await issueFormToken("order", t0);
    expect(await verifyFormToken(token, "card-contact", t0 + 5_000)).toBe(false);
    const [p, , sig] = token.split(".");
    expect(await verifyFormToken(`${p}.${t0 - 10_000}.${sig}`, "order", t0 + 5_000)).toBe(false);
    expect(await verifyFormToken("garbage", "order", t0 + 5_000)).toBe(false);
  });
});
