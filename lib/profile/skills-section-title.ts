export const SKILLS_SECTION_TITLES = ["expertise_areas", "skills"] as const;

export type SkillsSectionTitle = (typeof SKILLS_SECTION_TITLES)[number];

export const DEFAULT_SKILLS_SECTION_TITLE: SkillsSectionTitle = "expertise_areas";

export function isSkillsSectionTitle(value: string): value is SkillsSectionTitle {
  return (SKILLS_SECTION_TITLES as readonly string[]).includes(value);
}
