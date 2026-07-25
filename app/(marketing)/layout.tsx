import Link from "next/link";
import { useTranslations } from "next-intl";

import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-col">
      {/* Translucent rather than bordered: content passing underneath reads as
          depth, where a hairline rule would read as a toolbar. */}
      <header className="sticky top-0 z-10 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6">
          <Link href={routes.home} className="transition-opacity hover:opacity-70">
            <Wordmark />
          </Link>
          <nav className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link href={routes.login}>{t("nav.login")}</Link>
            </Button>
            <Button asChild size="sm">
              <Link href={routes.register}>{t("nav.register")}</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mx-auto w-full max-w-3xl px-6 pb-12">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t("app.name")}
        </p>
      </footer>
    </div>
  );
}
