import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Wordmark } from "@/components/brand/wordmark";
import { LegalLinks } from "@/components/legal/legal-links";
import { routes } from "@/lib/routes";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations();

  return (
    <div className="flex min-h-full flex-col">
      {/* Brand-only header — auth CTAs live in the hero. */}
      <header className="bg-background">
        <div className="mx-auto flex w-full max-w-3xl justify-center px-6 pt-10 pb-4 sm:pt-12 sm:pb-6">
          <Link href={routes.home} className="transition-opacity hover:opacity-70">
            <Wordmark />
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 px-6 pt-8 pb-12">
        <LegalLinks />
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t("app.name")}
        </p>
      </footer>
    </div>
  );
}
