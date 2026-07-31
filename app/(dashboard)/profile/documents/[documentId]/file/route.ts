import { notFound } from "next/navigation";

import { getOwnDocumentById } from "@/lib/dal/documents";
import { DOCUMENTS_BUCKET, inlinePdfContentDisposition } from "@/lib/profile/documents";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ documentId: string }>;
};

/**
 * Owner-only document preview. Streams with Content-Disposition: inline.
 * Reuses the CV file-serving pattern.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { documentId } = await context.params;
  const document = await getOwnDocumentById(documentId);
  if (!document) {
    notFound();
  }

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .download(document.storage_path);

  if (error || !data) {
    notFound();
  }

  const bytes = await data.arrayBuffer();

  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": inlinePdfContentDisposition(document.file_name),
      "Cache-Control": "private, no-store",
    },
  });
}
