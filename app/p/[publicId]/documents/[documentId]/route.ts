import { notFound, redirect } from "next/navigation";

import { recordCardEvent } from "@/lib/dal/analytics";
import { createDocumentSignedUrl, getPublishedDocumentPath } from "@/lib/dal/documents";

type RouteContext = {
  params: Promise<{ publicId: string; documentId: string }>;
};

const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Opens a visible document on a published card. The documents bucket is
 * private, so visitors get a short-lived signed URL rather than a permanent
 * public one: hiding the document or unpublishing the card cuts access off.
 * Redirecting (instead of proxying the bytes) keeps large PDFs clear of the
 * hosting platform's response-size limit.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { publicId, documentId } = await context.params;

  if (!ID_PATTERN.test(documentId)) {
    notFound();
  }

  const storagePath = await getPublishedDocumentPath(publicId, documentId);
  if (!storagePath) {
    notFound();
  }

  const signedUrl = await createDocumentSignedUrl(storagePath);
  if (!signedUrl) {
    notFound();
  }

  await recordCardEvent({ publicId, eventType: "document_open" });

  redirect(signedUrl);
}
