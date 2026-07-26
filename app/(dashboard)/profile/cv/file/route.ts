import { notFound } from "next/navigation";

import { getOwnCvDocument } from "@/lib/dal/documents";
import { DOCUMENTS_BUCKET } from "@/lib/profile/documents";
import { createClient } from "@/lib/supabase/server";

/**
 * Owner-only CV preview. Streams with Content-Disposition: inline.
 */
export async function GET() {
  const document = await getOwnCvDocument();
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

  const fileName = document.file_name.replace(/"/g, "");
  const bytes = await data.arrayBuffer();

  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
