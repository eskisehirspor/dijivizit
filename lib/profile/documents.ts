export const DOCUMENTS_BUCKET = "documents";

export const CV_DOCUMENT_TYPE = "cv";

export const CV_MAX_BYTES = 10_485_760; // 10 MiB — matches the storage bucket limit

export const CV_MIME_TYPE = "application/pdf" as const;

export type CvMimeType = typeof CV_MIME_TYPE;

export function isCvMimeType(value: string): value is CvMimeType {
  return value === CV_MIME_TYPE;
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
