import { notFound, redirect } from "next/navigation";

import { createDocumentSignedUrl, getOwnDocumentById } from "@/lib/dal/documents";

type RouteContext = {
  params: Promise<{ documentId: string }>;
};

const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Owner-only document preview via a short-lived signed URL. */
export async function GET(_request: Request, context: RouteContext) {
  const { documentId } = await context.params;
  if (!ID_PATTERN.test(documentId)) {
    notFound();
  }

  const document = await getOwnDocumentById(documentId);
  if (!document) {
    notFound();
  }

  const signedUrl = await createDocumentSignedUrl(document.storage_path);
  if (!signedUrl) {
    notFound();
  }

  redirect(signedUrl);
}
