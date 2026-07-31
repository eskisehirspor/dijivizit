import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CopyUrlButton } from "@/components/dashboard/copy-url-button";
import { PublishToggle } from "@/components/dashboard/publish-toggle";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Badge } from "@/components/ui/badge";
import { getOwnProfile } from "@/lib/dal/profile";
import { clientEnv } from "@/lib/env/client";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("dashboard");
  return { title: t("title") };
}

export default async function DashboardPage() {
  const [t, profile] = await Promise.all([getTranslations(), getOwnProfile()]);

  const publicPath = profile ? routes.publicCard(profile.public_id) : null;
  const publicUrl = publicPath ? `${clientEnv.NEXT_PUBLIC_SITE_URL}${publicPath}` : null;
  const isPublished = profile?.is_published ?? false;

  return (
    <div className="flex animate-rise flex-col gap-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          {profile?.full_name
            ? t("dashboard.greeting", { name: profile.full_name })
            : t("dashboard.greetingAnonymous")}
        </h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("dashboard.subtitle")}</p>
      </div>

      <section className="flex flex-col gap-6 rounded-lg border border-border/60 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium">{t("dashboard.cardStatus")}</h2>
          <Badge variant={isPublished ? "default" : "secondary"}>
            {isPublished ? t("dashboard.published") : t("dashboard.draft")}
          </Badge>
        </div>

        {profile ? <PublishToggle published={isPublished} /> : null}

        {publicUrl && publicPath ? (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">{t("dashboard.publicUrl")}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-sm break-all">{publicUrl}</p>
              <div className="flex flex-wrap items-center gap-3">
                <CopyUrlButton url={publicUrl} />
                {isPublished ? (
                  <Link
                    href={publicPath}
                    className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                  >
                    {t("dashboard.openPublic")}
                  </Link>
                ) : null}
              </div>
            </div>
            {!isPublished ? (
              <p className="text-xs text-pretty text-muted-foreground">
                {t("dashboard.publish.urlDraftHint")}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-pretty text-muted-foreground">{t("dashboard.emptyBody")}</p>
        )}
      </section>

      <QuickActions
        editHref={routes.profileEdit}
        avatarHref={routes.profileAvatar}
        linksHref={routes.profileLinks}
        skillsHref={routes.profileSkills}
        bankHref={routes.profileBank}
        billingHref={routes.profileBilling}
        cvHref={routes.profileCv}
        analyticsHref={routes.analytics}
        shareHref={routes.share}
        publicHref={isPublished ? publicPath : null}
      />
    </div>
  );
}
