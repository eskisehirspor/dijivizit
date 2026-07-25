import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { BasicInfoForm } from "@/components/profile/basic-info-form";
import { getOwnProfile } from "@/lib/dal/profile";
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
    <div className="flex animate-rise flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t("title")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("subtitle")}</p>
        <p className="pt-3">
          <Link
            href={routes.profileLinks}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("manageLinks")}
          </Link>
        </p>
      </div>

      <BasicInfoForm
        defaults={{
          fullName: profile.full_name ?? "",
          title: profile.title ?? "",
          company: profile.company ?? "",
          about: profile.about ?? "",
        }}
      />
    </div>
  );
}
