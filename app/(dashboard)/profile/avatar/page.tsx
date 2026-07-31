import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { AvatarManager } from "@/components/profile/avatar-manager";
import { getOwnProfile } from "@/lib/dal/profile";
import { getAvatarUrl } from "@/lib/dal/public-card";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("profile.avatar");
  return { title: t("title") };
}

export default async function ProfileAvatarPage() {
  const [t, profile] = await Promise.all([getTranslations("profile.avatar"), getOwnProfile()]);

  if (!profile) {
    redirect(routes.dashboard);
  }

  const avatarUrl = await getAvatarUrl(profile.avatar_path);

  return (
    <div className="flex animate-rise flex-col gap-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t("title")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("subtitle")}</p>
        <p className="pt-3">
          <Link
            href={routes.profileEdit}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("backToEdit")}
          </Link>
        </p>
      </div>

      <AvatarManager avatarUrl={avatarUrl} alt={profile.full_name ?? t("title")} />
    </div>
  );
}
