import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { LEGAL_SLUGS } from "@/lib/legal/documents";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** Footer row linking every legal text. */
export async function LegalLinks({ className }: { className?: string }) {
  const t = await getTranslations("legal.nav");

  return (
    <nav
      aria-label="Yasal"
      className={cn("flex flex-wrap justify-center gap-x-4 gap-y-2", className)}
    >
      {LEGAL_SLUGS.map((slug) => (
        <Link
          key={slug}
          href={routes.legal(slug)}
          className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          {t(slug)}
        </Link>
      ))}
    </nav>
  );
}
