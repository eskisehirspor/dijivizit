import { getTranslations } from "next-intl/server";

import { SkillForm } from "@/components/profile/skill-form";
import { SkillRow } from "@/components/profile/skill-row";
import type { OwnProfileSkill } from "@/lib/dal/profile-skills";
import { PROFILE_SKILL_LIMIT } from "@/lib/profile/skill-types";

export async function SkillsManager({ skills }: { skills: OwnProfileSkill[] }) {
  const t = await getTranslations("profile.skills");

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-medium">{t("listTitle")}</h2>
        <p className="text-xs text-muted-foreground tabular-nums">
          {t("counter", { current: skills.length, max: PROFILE_SKILL_LIMIT })}
        </p>
      </div>

      {skills.length === 0 ? (
        <p className="text-sm text-pretty text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="grid gap-4">
          {skills.map((skill, index) => (
            <SkillRow
              key={skill.id}
              skill={skill}
              isFirst={index === 0}
              isLast={index === skills.length - 1}
            />
          ))}
        </ul>
      )}

      <SkillForm skillCount={skills.length} />
    </div>
  );
}
