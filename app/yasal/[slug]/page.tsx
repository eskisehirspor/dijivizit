import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Wordmark } from "@/components/brand/wordmark";
import { LegalLinks } from "@/components/legal/legal-links";
import { LEGAL_DOCUMENTS, LEGAL_SLUGS, LEGAL_VERSION, type LegalSlug } from "@/lib/legal/documents";
import { routes } from "@/lib/routes";

type LegalPageProps = {
  params: Promise<{ slug: string }>;
};

function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as string[]).includes(value);
}

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isLegalSlug(slug)) {
    return {};
  }
  const document = LEGAL_DOCUMENTS[slug];
  return { title: document.title, description: document.summary };
}

const UPDATED = new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(
  new Date(`${LEGAL_VERSION}T12:00:00Z`),
);

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) {
    notFound();
  }

  const t = await getTranslations("legal");
  const document = LEGAL_DOCUMENTS[slug];

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center px-6">
          <Link
            href={routes.home}
            className="transition-opacity hover:opacity-70"
            aria-label={t("home")}
          >
            <Wordmark />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 sm:py-16">
        <article className="flex animate-rise flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-balance">{document.title}</h1>
            <p className="text-sm text-pretty text-muted-foreground">{document.summary}</p>
            <p className="text-xs text-muted-foreground">{t("updated", { date: UPDATED })}</p>
          </div>

          {document.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-3">
              <h2 className="text-sm font-medium">{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-relaxed text-pretty text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-pretty text-muted-foreground marker:text-border">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>
      </main>

      <footer className="mx-auto w-full max-w-3xl px-6 pt-8 pb-12">
        <LegalLinks />
      </footer>
    </div>
  );
}
