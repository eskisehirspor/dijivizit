// Row aliases for the tables the application touches.
//
// Kept apart from database.types.ts so that file can stay byte-for-byte what
// `npm run gen:types` produces — anything hand-written there is lost on the next
// regeneration.

import type { Tables, TablesInsert, TablesUpdate } from "./database.types";

export type ProfileRow = Tables<"profiles">;
export type ProfileUpdate = TablesUpdate<"profiles">;

export type ProfileLinkRow = Tables<"profile_links">;
export type ProfileLinkInsert = TablesInsert<"profile_links">;
export type ProfileLinkUpdate = TablesUpdate<"profile_links">;

export type ProfileSkillRow = Tables<"profile_skills">;
export type ProfileSkillInsert = TablesInsert<"profile_skills">;
export type ProfileSkillUpdate = TablesUpdate<"profile_skills">;
