import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ScanCard } from "@/components/contacts/scan-card";
import { requireUser } from "@/lib/dal/auth";
import { serverEnv } from "@/lib/env/server";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("scan");
  return { title: t("title") };
}

export default async function ScanCardPage() {
  await requireUser();
  const t = await getTranslations("scan");
  const enabled = Boolean(serverEnv.ANTHROPIC_API_KEY);

  return (
    <div className="flex animate-rise flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t("title")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("subtitle")}</p>
        <p className="pt-3">
          <Link
            href={routes.contacts}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("back")}
          </Link>
        </p>
      </div>
      {enabled ? (
        <ScanCard />
      ) : (
        <p className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          {t("errors.unavailable")}
        </p>
      )}
    </div>
  );
}
