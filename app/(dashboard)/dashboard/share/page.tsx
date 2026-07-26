import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { CopyUrlButton } from "@/components/dashboard/copy-url-button";
import { ShareQrCode } from "@/components/share/share-qr-code";
import { getOwnProfile } from "@/lib/dal/profile";
import { clientEnv } from "@/lib/env/client";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("dashboard.share");
  return { title: t("title") };
}

export default async function SharePage() {
  const [t, profile] = await Promise.all([getTranslations("dashboard.share"), getOwnProfile()]);

  if (!profile) {
    redirect(routes.dashboard);
  }

  const publicPath = routes.publicCard(profile.public_id);
  const publicUrl = `${clientEnv.NEXT_PUBLIC_SITE_URL}${publicPath}`;

  return (
    <div className="flex animate-rise flex-col gap-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t("title")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("subtitle")}</p>
        <div className="pt-3">
          <Link
            href={routes.dashboard}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("backToDashboard")}
          </Link>
        </div>
      </div>

      <section className="flex flex-col gap-4 rounded-lg border border-border/60 p-6">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-sm font-medium">{t("publicProfile.title")}</h2>
          <p className="text-xs text-pretty text-muted-foreground">
            {t("publicProfile.description")}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-sm break-all">{publicUrl}</p>
          <CopyUrlButton url={publicUrl} label={t("publicProfile.copyLink")} />
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-border/60 p-6">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-sm font-medium">{t("qr.title")}</h2>
          <p className="text-xs text-pretty text-muted-foreground">{t("qr.description")}</p>
        </div>
        <ShareQrCode url={publicUrl} />
      </section>
    </div>
  );
}
