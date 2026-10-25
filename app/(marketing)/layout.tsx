import { getTranslations } from "next-intl/server";

import { LegalLinks } from "@/components/legal/legal-links";
import { SiteHeader } from "@/components/marketing/site-header";
import { CONTACT } from "@/lib/contact";
import { GUIDES } from "@/lib/marketing/guides";
import Link from "next/link";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 text-sm sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="flex flex-col gap-2 text-muted-foreground">
            <p className="font-medium text-foreground">{t("app.name")}</p>
            <p>{CONTACT.addressLines.join(", ")}</p>
            <p>
              <a href={`tel:${CONTACT.phoneE164}`} className="hover:text-foreground">
                {CONTACT.phoneDisplay}
              </a>
              {" · "}
              <a href={`mailto:${CONTACT.orderEmail}`} className="hover:text-foreground">
                {CONTACT.orderEmail}
              </a>
            </p>
            <p className="text-xs">
              © {new Date().getFullYear()} {t("app.name")}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <nav
              aria-label="Rehber"
              className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground"
            >
              {GUIDES.map((g) => (
                <Link key={g.slug} href={`/rehber/${g.slug}`} className="hover:text-foreground">
                  {g.label}
                </Link>
              ))}
            </nav>
            <LegalLinks className="justify-start" />
          </div>
        </div>
      </footer>
    </div>
  );
}
