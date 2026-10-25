import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CardList, NewCardForm } from "@/components/cards/card-list";
import { CopyUrlButton } from "@/components/dashboard/copy-url-button";
import { listOwnCards } from "@/lib/dal/cards";
import { getOwnProfile } from "@/lib/dal/profile";
import { clientEnv } from "@/lib/env/client";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("cards");
  return { title: t("title") };
}

export default async function CardsPage() {
  const [t, profile, cards] = await Promise.all([
    getTranslations("cards"),
    getOwnProfile(),
    listOwnCards(),
  ]);
  const base = clientEnv.NEXT_PUBLIC_SITE_URL;
  const mainUrl = profile ? `${base}${routes.publicCard(profile.public_id)}` : null;

  return (
    <div className="flex animate-rise flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t("title")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("subtitle")}</p>
        <p className="pt-3">
          <Link
            href={routes.dashboard}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("back")}
          </Link>
        </p>
      </div>

      {mainUrl ? (
        <section className="flex flex-col gap-3 rounded-lg border border-border/60 p-6">
          <h2 className="text-sm font-medium">{t("mainTitle")}</h2>
          <p className="text-xs text-pretty text-muted-foreground">{t("mainBody")}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-sm break-all">{mainUrl}</p>
            <CopyUrlButton url={mainUrl} />
          </div>
        </section>
      ) : null}

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium">{t("personalTitle")}</h2>
          <p className="text-xs text-pretty text-muted-foreground">{t("personalBody")}</p>
        </div>
        <NewCardForm />
        <CardList cards={cards.personal} baseUrl={base} mode="personal" />
      </section>

      {cards.team.length > 0 ? (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-medium">{t("teamTitle")}</h2>
            <p className="text-xs text-pretty text-muted-foreground">{t("teamBody")}</p>
          </div>
          <CardList cards={cards.team} baseUrl={base} mode="assigned" />
        </section>
      ) : null}
    </div>
  );
}
