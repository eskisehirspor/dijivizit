import { getTranslations } from "next-intl/server";

import { LegalLinks } from "@/components/legal/legal-links";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {t("app.name")} · merhaba@dijivizit.com
          </p>
          <LegalLinks className="justify-start" />
        </div>
      </footer>
    </div>
  );
}
