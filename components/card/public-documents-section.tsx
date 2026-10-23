import { FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { PublicCardDocument } from "@/lib/validations/card";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export async function PublicDocumentsSection({
  publicId,
  documents,
  preview = false,
}: {
  publicId: string;
  documents: PublicCardDocument[];
  /** Owner preview: unpublished cards can't serve public document links. */
  preview?: boolean;
}) {
  const t = await getTranslations("card.documents");

  if (documents.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <header className="flex min-h-9 items-center gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <FileText aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </span>
        <h2 className="text-sm font-medium tracking-tight">{t("title")}</h2>
      </header>

      <ul className="flex flex-col gap-4">
        {documents.map((document) => (
          <li key={document.id}>
            <a
              href={
                preview
                  ? routes.profileDocumentFile(document.id)
                  : routes.publicDocument(publicId, document.id)
              }
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex min-h-10 items-center gap-3 rounded-lg border border-border/60 px-4 py-3 text-left transition-colors",
                "hover:border-border hover:bg-muted/40",
                "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
              )}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <FileText aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{document.title}</span>
                {document.description ? (
                  <span className="mt-0.5 block text-xs text-pretty text-muted-foreground">
                    {document.description}
                  </span>
                ) : null}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
