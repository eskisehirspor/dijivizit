import { describe, expect, it } from "vitest";

import {
  createProfileSkillSchema,
  updateProfileSkillSchema,
} from "@/lib/validations/profile-skills";

describe("createProfileSkillSchema", () => {
  it("accepts a trimmed expertise name", () => {
    const result = createProfileSkillSchema.safeParse({
      name: "  Ürün Yönetimi  ",
      type: "expertise",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      name: "Ürün Yönetimi",
      type: "expertise",
    });
  });

  it("accepts a skill type", () => {
    const result = createProfileSkillSchema.safeParse({
      name: "Figma",
      type: "skill",
    });

    expect(result.success).toBe(true);
    expect(result.data?.type).toBe("skill");
  });

  it("rejects an empty name", () => {
    const result = createProfileSkillSchema.safeParse({
      name: "   ",
      type: "skill",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a name longer than 60 characters", () => {
    const result = createProfileSkillSchema.safeParse({
      name: "a".repeat(61),
      type: "expertise",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid type", () => {
    const result = createProfileSkillSchema.safeParse({
      name: "React",
      type: "hobby",
    });

    expect(result.success).toBe(false);
  });
});

describe("updateProfileSkillSchema", () => {
  it("allows changing type while editing", () => {
    const result = updateProfileSkillSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "React",
      type: "expertise",
    });

    expect(result.success).toBe(true);
    expect(result.data?.type).toBe("expertise");
  });

  it("rejects an invalid id", () => {
    const result = updateProfileSkillSchema.safeParse({
      id: "not-a-uuid",
      name: "React",
      type: "skill",
    });

    expect(result.success).toBe(false);
  });
});
