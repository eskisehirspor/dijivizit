import { getTranslations } from "next-intl/server";

import { DocumentForm } from "@/components/profile/document-form";
import { DocumentRow } from "@/components/profile/document-row";
import type { OwnDocument } from "@/lib/dal/documents";
import { DOCUMENT_LIMIT } from "@/lib/profile/documents";

export async function DocumentsManager({ documents }: { documents: OwnDocument[] }) {
  const t = await getTranslations("profile.documents");

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-medium">{t("listTitle")}</h2>
        <p className="text-xs text-muted-foreground tabular-nums">
          {t("counter", { current: documents.length, max: DOCUMENT_LIMIT })}
        </p>
      </div>

      {documents.length === 0 ? (
        <p className="text-sm text-pretty text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="grid gap-4">
          {documents.map((document) => (
            <DocumentRow key={document.id} document={document} />
          ))}
        </ul>
      )}

      <DocumentForm documentCount={documents.length} />
    </div>
  );
}
