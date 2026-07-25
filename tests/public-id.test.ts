import { describe, expect, it } from "vitest";

import { PUBLIC_ID_LENGTH, isValidPublicId } from "@/lib/utils/public-id";

describe("isValidPublicId", () => {
  it("accepts an 11-character base62 id", () => {
    expect(isValidPublicId("A8fK29LmQx7")).toBe(true);
    expect(isValidPublicId("00000000000")).toBe(true);
    expect(isValidPublicId("zzzzzzzzzzz")).toBe(true);
  });

  it("rejects ids of the wrong length", () => {
    expect(isValidPublicId("")).toBe(false);
    expect(isValidPublicId("A8fK29LmQx")).toBe(false);
    expect(isValidPublicId("A8fK29LmQx77")).toBe(false);
  });

  it("rejects characters outside the base62 alphabet", () => {
    expect(isValidPublicId("A8fK29LmQx-")).toBe(false);
    expect(isValidPublicId("A8fK29LmQx_")).toBe(false);
    expect(isValidPublicId("A8fK29LmQx.")).toBe(false);
    expect(isValidPublicId("A8fK29LmQx/")).toBe(false);
  });

  it("rejects payloads that could reach the database as path traversal or SQL", () => {
    expect(isValidPublicId("../../etc/pw")).toBe(false);
    expect(isValidPublicId("' or 1=1 --")).toBe(false);
  });

  it("anchors the pattern so extra lines cannot slip through", () => {
    expect(isValidPublicId("A8fK29LmQx7\nmalicious")).toBe(false);
  });

  it("agrees with the declared length", () => {
    expect(isValidPublicId("a".repeat(PUBLIC_ID_LENGTH))).toBe(true);
  });
});
