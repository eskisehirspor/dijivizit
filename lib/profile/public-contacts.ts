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
  "address",
]);

/** Preferred display order for contact rows. */
const CONTACT_ORDER = [
  "phone",
  "whatsapp",
  "email",
  "website",
  "address",
  "linkedin",
  "instagram",
] as const;

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

function sortContactLinks(links: PublicCardLink[]): PublicCardLink[] {
  const rank = new Map(CONTACT_ORDER.map((platform, index) => [platform, index]));
  return [...links].sort((a, b) => {
    const aRank = rank.get(a.platform as (typeof CONTACT_ORDER)[number]) ?? CONTACT_ORDER.length;
    const bRank = rank.get(b.platform as (typeof CONTACT_ORDER)[number]) ?? CONTACT_ORDER.length;
    return aRank - bRank;
  });
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
  const withAddress =
    trimmedAddress && trimmedAddress.length > 0
      ? [...fromLinks, { platform: "address", label: null, value: trimmedAddress }]
      : fromLinks;

  return sortContactLinks(withAddress);
}
