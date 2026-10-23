import { withResolvedPhoneLink } from "@/lib/share/vcard-from-card";
import type { PublicCardLink } from "@/lib/validations/card";

/** Platforms shown as tappable contact rows on the public profile. */
const VISIBLE_CONTACT_PLATFORMS = new Set([
  "phone",
  "whatsapp",
  "email",
  "website",
  "linkedin",
  "instagram",
  "x",
  "address",
]);

/** Social profiles; the address row is placed just before the first of these. */
const SOCIAL_PLATFORMS = new Set(["linkedin", "instagram", "x"]);

function normalizeUrlCandidate(value: string): string {
  return value.trim().replace(/\/+$/, "").toLowerCase();
}

function isPublicProfileUrl(value: string, publicUrl: string): boolean {
  const normalizedValue = normalizeUrlCandidate(value);
  const normalizedPublic = normalizeUrlCandidate(publicUrl);

  if (!normalizedValue || !normalizedPublic) {
    return false;
  }

  if (normalizedValue === normalizedPublic) {
    return true;
  }

  try {
    const withScheme = /^https?:\/\//i.test(value.trim())
      ? value.trim()
      : `https://${value.trim()}`;
    const url = new URL(withScheme);
    const publicParsed = new URL(publicUrl);
    return (
      url.pathname.replace(/\/+$/, "") === publicParsed.pathname.replace(/\/+$/, "") &&
      (url.hostname === publicParsed.hostname ||
        url.hostname === `www.${publicParsed.hostname}` ||
        `www.${url.hostname}` === publicParsed.hostname)
    );
  } catch {
    return false;
  }
}

/**
 * Keeps the owner's own ordering (the card RPC returns links by display_order)
 * and slots the profile address in after the direct contact methods.
 */
function insertAddress(links: PublicCardLink[], address: PublicCardLink | null): PublicCardLink[] {
  if (!address) {
    return links;
  }

  const firstSocial = links.findIndex((link) => SOCIAL_PLATFORMS.has(link.platform));
  if (firstSocial === -1) {
    return [...links, address];
  }

  return [...links.slice(0, firstSocial), address, ...links.slice(firstSocial)];
}

/**
 * Contact rows for the public profile UI.
 * Keeps real contact methods only — never the Dijivizit public profile URL.
 */
export function visiblePublicContactLinks(
  links: PublicCardLink[],
  publicUrl: string,
  address?: string | null,
): PublicCardLink[] {
  const fromLinks = withResolvedPhoneLink(links).filter((link) => {
    if (!VISIBLE_CONTACT_PLATFORMS.has(link.platform) || link.platform === "address") {
      return false;
    }

    if (isPublicProfileUrl(link.value, publicUrl)) {
      return false;
    }

    return Boolean(link.value.trim());
  });

  const trimmedAddress = address?.trim();

  return insertAddress(
    fromLinks,
    trimmedAddress ? { platform: "address", label: null, value: trimmedAddress } : null,
  );
}
