import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { CoverManager, ThemePicker, VanityForm } from "@/components/profile/appearance-editor";
import { getOwnAppearance } from "@/lib/dal/profile-appearance";
import { getOwnProfile } from "@/lib/dal/profile";
import { getAvatarUrl } from "@/lib/dal/public-card";
import { clientEnv } from "@/lib/env/client";
import { toVanitySlug } from "@/lib/profile/vanity";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("profile.appearance");
  return { title: t("title") };
}

export default async function ProfileAppearancePage() {
  const [t, profile, appearance] = await Promise.all([
    getTranslations("profile.appearance"),
    getOwnProfile(),
    getOwnAppearance(),
  ]);

  if (!profile || !appearance) {
    redirect(routes.dashboard);
  }

  const coverUrl = await getAvatarUrl(appearance.coverPath);

  return (
    <div className="flex animate-rise flex-col gap-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t("title")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("subtitle")}</p>
        <p className="flex flex-wrap gap-x-6 gap-y-2 pt-3">
          <Link
            href={routes.profileEdit}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("backToEdit")}
          </Link>
          <Link
            href={routes.cardPreview}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("preview")}
          </Link>
        </p>
      </div>

      <ThemePicker current={appearance.theme} />
      <CoverManager coverUrl={coverUrl} />
      <VanityForm
        current={appearance.vanitySlug}
        suggestion={toVanitySlug(profile.full_name ?? "")}
        siteUrl={clientEnv.NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, "")}
      />
    </div>
  );
}
