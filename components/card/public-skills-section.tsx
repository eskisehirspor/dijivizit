import { FileBadge } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { SkillsSectionTitle } from "@/lib/profile/skills-section-title";
import type { PublicCardSkill } from "@/lib/validations/card";

export async function PublicSkillsSection({
  titleKey,
  skills,
}: {
  titleKey: SkillsSectionTitle;
  skills: PublicCardSkill[];
}) {
  const t = await getTranslations("card.skills");

  if (skills.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-5">
      <header className="flex items-center justify-center gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <FileBadge aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </span>
        <h2 className="text-sm font-medium tracking-tight">{t(`titles.${titleKey}`)}</h2>
      </header>

      <ul className="flex flex-wrap justify-center gap-2.5">
        {skills.map((skill) => (
          <li
            key={`${skill.type}-${skill.name}`}
            className="rounded-lg border border-border/60 px-3 py-1.5 text-xs text-muted-foreground"
          >
            {skill.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
