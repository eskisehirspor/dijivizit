import { notFound } from "next/navigation";

import { getPublicCard } from "@/lib/dal/public-card";
import { DOCUMENTS_BUCKET } from "@/lib/profile/documents";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ publicId: string }>;
};

/**
 * Serves the published CV PDF with Content-Disposition: inline so browsers
 * preview in a new tab instead of forcing a download.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { publicId } = await context.params;
  const card = await getPublicCard(publicId);

  if (!card?.cv?.storagePath) {
    notFound();
  }

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .download(card.cv.storagePath);

  if (error || !data) {
    notFound();
  }

  const fileName = card.cv.fileName.replace(/"/g, "");
  const bytes = await data.arrayBuffer();

  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": "private, max-age=300",
    },
  });
}
