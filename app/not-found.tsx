import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex max-w-sm animate-rise flex-col items-center gap-3">
        <h1 className="text-2xl font-semibold text-balance">{t("notFoundTitle")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("notFoundBody")}</p>
        <Button asChild className="mt-5">
          <Link href={routes.home}>{t("backHome")}</Link>
        </Button>
      </div>
    </div>
  );
}
