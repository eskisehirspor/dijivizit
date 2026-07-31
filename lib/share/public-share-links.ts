/** Share deep-links for a published public profile URL. */

export function whatsappShareHref(publicUrl: string): string {
  return `https://wa.me/?text=${encodeURIComponent(publicUrl)}`;
}

export function telegramShareHref(publicUrl: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(publicUrl)}`;
}

export function emailShareHref(publicUrl: string, subject: string): string {
  const params = new URLSearchParams({
    subject,
    body: publicUrl,
  });
  return `mailto:?${params.toString()}`;
}
