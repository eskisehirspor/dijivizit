import { resolvePhoneFromLinks } from "@/lib/profile/resolve-phone";
import type { PublicCard, PublicCardLink } from "@/lib/validations/card";

import type { VcardInput } from "./vcard";

/** First non-empty value for a platform on a public card. */
export function publicLinkValue(links: PublicCard["links"], platform: string): string | null {
  const match = links.find((link) => link.platform === platform && link.value.trim());
  return match ? match.value.trim() : null;
}

/**
 * Ensures the public card contact list exposes a dialable phone item when a
 * number exists (explicit phone row, or recoverable from WhatsApp).
 */
export function withResolvedPhoneLink(links: PublicCard["links"]): PublicCardLink[] {
  if (links.some((link) => link.platform === "phone" && link.value.trim())) {
    return links;
  }

  const phone = resolvePhoneFromLinks(links);
  if (!phone) {
    return links;
  }

  return [{ platform: "phone", label: null, value: phone }, ...links];
}

function linksOf(links: PublicCard["links"], platform: string) {
  return links
    .filter((link) => link.platform === platform && link.value.trim())
    .map((link) => ({ value: link.value.trim(), label: link.label }));
}

/** Maps a published public card into vCard builder input. */
export function vcardInputFromPublicCard(card: PublicCard, publicUrl: string): VcardInput {
  const phones = linksOf(card.links, "phone");
  const fallbackPhone = phones.length === 0 ? resolvePhoneFromLinks(card.links) : null;

  return {
    phones: fallbackPhone ? [{ value: fallbackPhone }] : phones,
    emails: linksOf(card.links, "email"),
    websites: linksOf(card.links, "website"),
    fullName: card.fullName,
    title: card.title,
    company: card.company,
    phone: resolvePhoneFromLinks(card.links),
    email: publicLinkValue(card.links, "email"),
    website: publicLinkValue(card.links, "website"),
    linkedin: publicLinkValue(card.links, "linkedin"),
    instagram: publicLinkValue(card.links, "instagram"),
    x: publicLinkValue(card.links, "x"),
    facebook: publicLinkValue(card.links, "facebook"),
    whatsapp: publicLinkValue(card.links, "whatsapp"),
    address: card.address?.trim() ? card.address.trim() : null,
    publicUrl,
  };
}
