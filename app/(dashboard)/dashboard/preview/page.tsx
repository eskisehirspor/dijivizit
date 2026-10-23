import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { PublicCardView } from "@/components/card/public-card-view";
import { getOwnCardPreview } from "@/lib/dal/card-preview";
import { getOwnProfile } from "@/lib/dal/profile";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("dashboard.preview");
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function CardPreviewPage() {
  const [t, card, profile] = await Promise.all([
    getTranslations("dashboard.preview"),
    getOwnCardPreview(),
    getOwnProfile(),
  ]);

  if (!card) {
    notFound();
  }

  const published = profile?.is_published ?? false;

  return (
    <div className="-mx-6 -my-12 sm:-my-16">
      <PublicCardView
        card={card}
        preview
        banner={
          <div className="flex flex-col gap-2 rounded-lg bg-muted/60 px-4 py-3 text-sm">
            <p className="font-medium">{published ? t("publishedTitle") : t("draftTitle")}</p>
            <p className="text-xs text-pretty text-muted-foreground">
              {published ? t("publishedBody") : t("draftBody")}
            </p>
            <Link
              href={routes.dashboard}
              className="w-fit text-xs font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
            >
              {t("back")}
            </Link>
          </div>
        }
      />
    </div>
  );
}
