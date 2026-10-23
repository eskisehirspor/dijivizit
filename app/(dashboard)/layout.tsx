import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { logoutAction } from "@/app/(auth)/actions";
import { Wordmark } from "@/components/brand/wordmark";
import { LegalLinks } from "@/components/legal/legal-links";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/dal/auth";
import { routes } from "@/lib/routes";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // middleware.ts already redirects unauthenticated visitors, but Server Actions
  // rendered under this layout are not covered by its matcher, so the session is
  // verified here as well.
  await requireUser();

  const t = await getTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border/60">
        <div className="mx-auto flex min-h-28 w-full max-w-3xl items-center justify-between px-6 pt-5 pb-3">
          <Link href={routes.dashboard} className="transition-opacity hover:opacity-70">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" className="h-10">
              <Link href={routes.settings}>{t("nav.settings")}</Link>
            </Button>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" className="h-10">
                {t("nav.logout")}
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 sm:py-16">{children}</main>

      <footer className="mx-auto w-full max-w-3xl px-6 pb-10">
        <LegalLinks />
      </footer>
    </div>
  );
}
