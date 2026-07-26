/**
 * Resolves a dialable phone number from public/own profile links.
 * Prefers an explicit phone row; otherwise derives E.164 from a wa.me WhatsApp URL.
 */
export function phoneFromWhatsappValue(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");
    if (host !== "wa.me" && host !== "api.whatsapp.com" && host !== "whatsapp.com") {
      return null;
    }

    const digits =
      host === "wa.me"
        ? url.pathname.replace(/\D/g, "")
        : (url.searchParams.get("phone") ?? "").replace(/\D/g, "");

    if (digits.length < 8 || digits.length > 15) {
      return null;
    }

    return `+${digits}`;
  } catch {
    return null;
  }
}

export function resolvePhoneFromLinks(
  links: readonly { platform: string; value: string }[],
): string | null {
  const phone = links.find((link) => link.platform === "phone" && link.value.trim());
  if (phone) {
    return phone.value.trim();
  }

  const whatsapp = links.find((link) => link.platform === "whatsapp" && link.value.trim());
  if (!whatsapp) {
    return null;
  }

  return phoneFromWhatsappValue(whatsapp.value);
}
