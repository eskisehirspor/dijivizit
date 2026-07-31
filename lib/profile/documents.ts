export const DOCUMENTS_BUCKET = "documents";

/** Max documents per user — enforced in the DAL. */
export const DOCUMENT_LIMIT = 10;

export const DOCUMENT_MAX_BYTES = 10_485_760; // 10 MiB — matches the storage bucket limit

export const DOCUMENT_MIME_TYPE = "application/pdf" as const;

export type DocumentMimeType = typeof DOCUMENT_MIME_TYPE;

export const DOCUMENT_TYPES = [
  "cv",
  "product_catalog",
  "price_list",
  "brochure",
  "presentation",
  "technical",
  "other",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export function isDocumentType(value: string): value is DocumentType {
  return (DOCUMENT_TYPES as readonly string[]).includes(value);
}

export function isDocumentMimeType(value: string): value is DocumentMimeType {
  return value === DOCUMENT_MIME_TYPE;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
  }
  const mb = bytes / (1024 * 1024);
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

/**
 * Content-Disposition for inline PDF preview.
 * `filename=` must be ASCII (Fetch forbids non-ByteString header values);
 * the real name goes in RFC 5987 `filename*`.
 */
export function inlinePdfContentDisposition(fileName: string): string {
  const cleaned = fileName.replace(/"/g, "").trim() || "document.pdf";
  const asciiFallback = cleaned.replace(/[^\x20-\x7E]/g, "_") || "document.pdf";
  return `inline; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(cleaned)}`;
}
