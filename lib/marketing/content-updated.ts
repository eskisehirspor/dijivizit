/**
 * Last time the marketing copy and prices were reviewed. Feeds the sitemap's
 * lastModified, the homepage's dateModified and its visible "Son güncelleme"
 * line, so all three always agree. Bump when landing, product or price copy
 * changes.
 */
export const CONTENT_UPDATED = "2026-11-13";

/** "13 Kasım 2026" */
export function formatContentUpdated(iso: string = CONTENT_UPDATED): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
