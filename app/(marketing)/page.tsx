import Link from "next/link";
import { useTranslations } from "next-intl";

import { CardPreview } from "@/components/marketing/card-preview";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function HomePage() {
  const t = useTranslations();

  return (
    <section className="mx-auto w-full max-w-3xl px-6 pt-28 pb-32 sm:pt-40">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-7 text-center">
        <h1 className="text-[2.75rem] leading-[1.08] font-semibold text-balance sm:text-6xl">
          {t("marketing.heroTitle")}
        </h1>

        <p className="max-w-md text-lg leading-relaxed text-pretty text-muted-foreground">
          {t("marketing.heroSubtitle")}
        </p>

        <div className="mt-3 flex items-center gap-6">
          <Button asChild size="lg">
            <Link href={routes.register}>{t("marketing.ctaPrimary")}</Link>
          </Button>
          <Link
            href={routes.login}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("marketing.ctaSecondary")}
          </Link>
        </div>
      </div>

      <div className="mt-22 sm:mt-28">
        <CardPreview />
      </div>
    </section>
  );
}
