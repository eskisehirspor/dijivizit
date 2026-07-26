/**
 * Builds an actionable href for a public card link from the stored platform + value.
 * Values are already normalised at write time (full URLs for social/WhatsApp/website).
 */
export function hrefForPublicLink(platform: string, value: string): string {
  const trimmed = value.trim();

  switch (platform) {
    case "phone":
      return `tel:${trimmed.replace(/[^\d+]/g, "")}`;
    case "email":
      return `mailto:${trimmed}`;
    case "address":
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
    default:
      return trimmed;
  }
}
