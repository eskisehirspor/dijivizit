import { getTranslations } from "next-intl/server";

import { CopyUrlButton } from "@/components/dashboard/copy-url-button";
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

      <section className="flex flex-col gap-5 rounded-lg border border-border/60 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium">{t("dashboard.cardStatus")}</h2>
          <Badge variant={profile?.is_published ? "default" : "secondary"}>
            {profile?.is_published ? t("dashboard.published") : t("dashboard.draft")}
          </Badge>
        </div>

        {publicUrl && publicPath ? (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">{t("dashboard.publicUrl")}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-sm break-all">{publicUrl}</p>
              <CopyUrlButton url={publicUrl} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-pretty text-muted-foreground">{t("dashboard.emptyBody")}</p>
        )}
      </section>

      <QuickActions editHref={routes.profileEdit} publicHref={publicPath} />
    </div>
  );
}
