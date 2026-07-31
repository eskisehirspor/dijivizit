import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { BasicInfoForm } from "@/components/profile/basic-info-form";
import { getOwnProfile } from "@/lib/dal/profile";
import {
  DEFAULT_SKILLS_SECTION_TITLE,
  isSkillsSectionTitle,
} from "@/lib/profile/skills-section-title";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("profile.edit");
  return { title: t("title") };
}

export default async function ProfileEditPage() {
  const [t, profile] = await Promise.all([getTranslations("profile.edit"), getOwnProfile()]);

  if (!profile) {
    redirect(routes.dashboard);
  }

  return (
    <div className="flex animate-rise flex-col gap-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t("title")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("subtitle")}</p>
        <p className="pt-3">
          <Link
            href={routes.dashboard}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("backToDashboard")}
          </Link>
        </p>
        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
          <Link
            href={routes.profileAvatar}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("manageAvatar")}
          </Link>
          <Link
            href={routes.profileLinks}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("manageLinks")}
          </Link>
          <Link
            href={routes.profileSkills}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("manageSkills")}
          </Link>
        </div>
      </div>

      <BasicInfoForm
        defaults={{
          fullName: profile.full_name ?? "",
          title: profile.title ?? "",
          company: profile.company ?? "",
          about: profile.about ?? "",
          address: profile.address ?? "",
          skillsSectionTitle: isSkillsSectionTitle(profile.skills_section_title)
            ? profile.skills_section_title
            : DEFAULT_SKILLS_SECTION_TITLE,
        }}
      />
    </div>
  );
}
