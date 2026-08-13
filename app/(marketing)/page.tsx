import Link from "next/link";
import { useTranslations } from "next-intl";

import { MetalCardShowcase } from "@/components/marketing/metal-card-showcase";
import { Button } from "@/components/ui/button";
import { clientEnv } from "@/lib/env/client";
import { joinOriginPath } from "@/lib/hosts";
import { routes } from "@/lib/routes";

export default function HomePage() {
  const t = useTranslations();
  const registerHref = joinOriginPath(clientEnv.NEXT_PUBLIC_SITE_URL, routes.register);
  const loginHref = joinOriginPath(clientEnv.NEXT_PUBLIC_SITE_URL, routes.login);

  return (
    <section className="mx-auto w-full max-w-3xl px-6 pt-16 pb-32 sm:pt-20 sm:pb-40">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8 text-center sm:gap-10">
        <h1 className="text-[2.75rem] leading-[1.08] font-semibold tracking-tight text-balance sm:text-6xl">
          {t("marketing.heroTitle")}
        </h1>

        <p className="max-w-md text-lg leading-relaxed text-pretty text-muted-foreground">
          {t("marketing.heroSubtitle")}
        </p>

        <div className="flex items-center gap-8 pt-2">
          <Button asChild size="lg" className="h-12 px-6 text-base">
            <Link href={registerHref}>{t("marketing.ctaPrimary")}</Link>
          </Button>
          <Link
            href={loginHref}
            className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("marketing.ctaSecondary")}
          </Link>
        </div>
      </div>

      <div className="mt-24 sm:mt-32">
        <MetalCardShowcase />
      </div>
    </section>
  );
}
