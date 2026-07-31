import { getTranslations } from "next-intl/server";

export default async function DashboardLoading() {
  const t = await getTranslations("common");

  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <p className="sr-only">{t("loading")}</p>
      <div className="h-8 w-48 max-w-full animate-pulse rounded-md bg-muted/60" />
      <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-muted/60" />
      <div className="h-40 animate-pulse rounded-lg bg-muted/60" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-28 animate-pulse rounded-lg bg-muted/60" />
        <div className="h-28 animate-pulse rounded-lg bg-muted/60" />
      </div>
    </div>
  );
}
