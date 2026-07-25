export const PROFILE_SKILL_TYPES = ["expertise", "skill"] as const;

export type ProfileSkillType = (typeof PROFILE_SKILL_TYPES)[number];

export const PROFILE_SKILL_LIMIT = 20;

export function isProfileSkillType(value: string): value is ProfileSkillType {
  return (PROFILE_SKILL_TYPES as readonly string[]).includes(value);
}
