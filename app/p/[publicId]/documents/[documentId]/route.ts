import { notFound } from "next/navigation";

import { recordCardEvent } from "@/lib/dal/analytics";
import { getPublicCard } from "@/lib/dal/public-card";
import { DOCUMENTS_BUCKET, inlinePdfContentDisposition } from "@/lib/profile/documents";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ publicId: string; documentId: string }>;
};

/**
 * Serves a published document PDF with Content-Disposition: inline so browsers
 * preview in a new tab instead of forcing a download.
 * Reuses the previous public CV streaming pattern.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { publicId, documentId } = await context.params;
  const card = await getPublicCard(publicId);
  if (!card) {
    notFound();
  }

  const document = card.documents.find((item) => item.id === documentId);
  if (!document?.storagePath) {
    notFound();
  }

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .download(document.storagePath);

  if (error || !data) {
    notFound();
  }

  const bytes = await data.arrayBuffer();

  await recordCardEvent({ publicId: card.publicId, eventType: "document_open" });

  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": inlinePdfContentDisposition(document.fileName),
      "Cache-Control": "private, max-age=300",
    },
  });
}
