import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { logoutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/dal/auth";
import { routes } from "@/lib/routes";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // proxy.ts already redirects unauthenticated visitors, but Server Actions
  // rendered under this layout are not covered by its matcher, so the session is
  // verified here as well.
  await requireUser();

  const t = await getTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6">
          <Link
            href={routes.dashboard}
            className="text-[0.9375rem] font-medium tracking-tight transition-opacity hover:opacity-70"
          >
            {t("app.name")}
          </Link>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm">
              {t("nav.logout")}
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">{children}</main>
    </div>
  );
}
