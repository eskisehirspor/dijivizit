import "server-only";

import { cache } from "react";

import type { ProfileSkillRow } from "@/lib/db/tables";
import {
  isProfileSkillType,
  PROFILE_SKILL_LIMIT,
  type ProfileSkillType,
} from "@/lib/profile/skill-types";
import { createClient } from "@/lib/supabase/server";
import type {
  CreateProfileSkillInput,
  UpdateProfileSkillInput,
} from "@/lib/validations/profile-skills";

import { requireUser } from "./auth";

export type OwnProfileSkill = Omit<
  Pick<ProfileSkillRow, "id" | "name" | "type" | "display_order" | "created_at">,
  "type"
> & {
  type: ProfileSkillType;
};

const SKILL_COLUMNS = "id, name, type, display_order, created_at";

export const getOwnProfileSkills = cache(async (): Promise<OwnProfileSkill[]> => {
  const user = await requireUser();
  const supabase = await createClient();

  // Combined list ordered by display_order so Up/Down matches what the owner sees.
  const { data, error } = await supabase
    .from("profile_skills")
    .select(SKILL_COLUMNS)
    .eq("profile_id", user.id)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load profile skills: ${error.message}`);
  }

  return (data ?? []).map((row) => {
    if (!isProfileSkillType(row.type)) {
      throw new Error(`Unexpected profile skill type: ${row.type}`);
    }

    return { ...row, type: row.type };
  });
});

export async function createOwnProfileSkill(
  input: CreateProfileSkillInput,
): Promise<{ ok: true } | { ok: false; code: "limit" | "duplicate" | "unknown" }> {
  const user = await requireUser();
  const supabase = await createClient();

  const existing = await getOwnProfileSkills();
  if (existing.length >= PROFILE_SKILL_LIMIT) {
    return { ok: false, code: "limit" };
  }

  const nextOrder =
    existing.length === 0 ? 0 : Math.max(...existing.map((skill) => skill.display_order)) + 1;

  const { error } = await supabase.from("profile_skills").insert({
    profile_id: user.id,
    name: input.name,
    type: input.type,
    display_order: nextOrder,
  });

  if (error) {
    if (error.message.includes("maximum of")) {
      return { ok: false, code: "limit" };
    }
    if (error.code === "23505") {
      return { ok: false, code: "duplicate" };
    }
    return { ok: false, code: "unknown" };
  }

  return { ok: true };
}

export async function updateOwnProfileSkill(
  input: UpdateProfileSkillInput,
): Promise<{ ok: true } | { ok: false; code: "duplicate" | "unknown" }> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profile_skills")
    .update({ name: input.name, type: input.type })
    .eq("id", input.id)
    .eq("profile_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return { ok: false, code: "duplicate" };
    }
    return { ok: false, code: "unknown" };
  }

  if (!data) {
    return { ok: false, code: "unknown" };
  }

  return { ok: true };
}

export async function deleteOwnProfileSkill(id: string): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profile_skills")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return true;
}

export async function moveOwnProfileSkill(id: string, direction: "up" | "down"): Promise<boolean> {
  const user = await requireUser();
  const skills = await getOwnProfileSkills();
  const index = skills.findIndex((skill) => skill.id === id);

  if (index === -1) {
    return false;
  }

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= skills.length) {
    return true;
  }

  const current = skills[index];
  const neighbor = skills[swapIndex];
  if (!current || !neighbor) {
    return false;
  }

  const supabase = await createClient();

  const { error: firstError } = await supabase
    .from("profile_skills")
    .update({ display_order: neighbor.display_order })
    .eq("id", current.id)
    .eq("profile_id", user.id);

  if (firstError) {
    return false;
  }

  const { error: secondError } = await supabase
    .from("profile_skills")
    .update({ display_order: current.display_order })
    .eq("id", neighbor.id)
    .eq("profile_id", user.id);

  if (secondError) {
    return false;
  }

  return true;
}
