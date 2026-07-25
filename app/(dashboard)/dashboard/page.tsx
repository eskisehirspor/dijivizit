import { getTranslations } from "next-intl/server";

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

  const publicUrl = profile
    ? `${clientEnv.NEXT_PUBLIC_SITE_URL}${routes.publicCard(profile.public_id)}`
    : null;

  return (
    <div className="flex animate-rise flex-col gap-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold">{t("dashboard.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {profile?.full_name
            ? t("dashboard.greeting", { name: profile.full_name })
            : t("dashboard.greetingAnonymous")}
        </p>
      </div>

      <section className="flex flex-col gap-5 rounded-lg border border-border/60 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium">{t("dashboard.cardStatus")}</h2>
          <Badge variant={profile?.is_published ? "default" : "secondary"}>
            {profile?.is_published ? t("dashboard.published") : t("dashboard.draft")}
          </Badge>
        </div>

        {publicUrl ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-muted-foreground">{t("dashboard.publicUrl")}</p>
            <p className="font-mono text-sm break-all">{publicUrl}</p>
          </div>
        ) : (
          <p className="text-sm text-pretty text-muted-foreground">{t("dashboard.emptyBody")}</p>
        )}
      </section>
    </div>
  );
}
