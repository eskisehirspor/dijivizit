import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { getOwnAnalyticsSummary } from "@/lib/dal/analytics";
import { routes } from "@/lib/routes";
import { ANALYTICS_EVENT_TYPES } from "@/lib/validations/analytics";
import { cn } from "@/lib/utils";

export async function generateMetadata() {
  const t = await getTranslations("dashboard.analytics");
  return { title: t("title") };
}

export default async function AnalyticsPage() {
  const [t, summary] = await Promise.all([
    getTranslations("dashboard.analytics"),
    getOwnAnalyticsSummary(),
  ]);

  const viewCards = [
    { key: "total", label: t("views.total"), value: summary.profileViewsTotal },
    { key: "today", label: t("views.today"), value: summary.profileViewsToday },
    { key: "week", label: t("views.week"), value: summary.profileViewsWeek },
    { key: "month", label: t("views.month"), value: summary.profileViewsMonth },
  ] as const;

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

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium">{t("views.title")}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {viewCards.map((card) => (
            <li key={card.key}>
              <StatCard label={card.label} value={card.value} />
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium">{t("events.title")}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {/* cv_open is a legacy event that nothing records any more. */}
          {ANALYTICS_EVENT_TYPES.filter((eventType) => eventType !== "cv_open").map((eventType) => (
            <li key={eventType}>
              <StatCard
                label={t(`events.types.${eventType}`)}
                value={summary.byType[eventType] ?? 0}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className={cn("flex h-full flex-col gap-3 rounded-lg border border-border/60 p-6")}>
      <p className="text-xs text-pretty text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
    </div>
  );
}
