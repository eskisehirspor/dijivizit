import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { LinksManager } from "@/components/profile/links-manager";
import { getOwnProfileLinks } from "@/lib/dal/profile-links";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("profile.links");
  return { title: t("title") };
}

export default async function ProfileLinksPage() {
  const [t, links] = await Promise.all([getTranslations("profile.links"), getOwnProfileLinks()]);

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

      <LinksManager links={links} />
    </div>
  );
}
