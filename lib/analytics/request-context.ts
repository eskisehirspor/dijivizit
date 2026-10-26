import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";

export type VisitContext = {
  country: string | null;
  city: string | null;
  device: "ios" | "android" | "desktop" | "other" | null;
  /** In-app browser hint from the user agent (Instagram, Facebook, LinkedIn). */
  inApp: string | null;
};

function deviceFromUa(ua: string): VisitContext["device"] {
  if (!ua) return null;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Windows|Macintosh|Linux|CrOS/i.test(ua)) return "desktop";
  return "other";
}

function inAppFromUa(ua: string): string | null {
  if (/Instagram/i.test(ua)) return "instagram";
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return "facebook";
  if (/LinkedInApp/i.test(ua)) return "linkedin";
  return null;
}

/**
 * Approximate location and device of the current request, for analytics.
 * Country and city come from Cloudflare's IP geolocation; the IP itself is not
 * kept. Outside Workers (local dev) location is simply unknown.
 */
export async function visitContext(): Promise<VisitContext> {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  let country = h.get("cf-ipcountry");
  let city = h.get("cf-ipcity");
  try {
    const cf = getCloudflareContext().cf as { country?: string; city?: string } | undefined;
    country = cf?.country ?? country;
    city = cf?.city ?? city;
  } catch {
    // not running on Workers
  }
  return {
    country: country && /^[A-Za-z]{2}$/.test(country) ? country.toUpperCase() : null,
    city: city ? city.slice(0, 80) : null,
    device: deviceFromUa(ua),
    inApp: inAppFromUa(ua),
  };
}

/**
 * Where a visit came from, from the page's document.referrer host:
 * "direct" for NFC taps, QR scans and typed links (no referrer).
 */
export function sourceFromReferrer(host: string | null | undefined, inApp: string | null): string {
  const h = (host ?? "").toLowerCase().replace(/^www\./, "");
  if (!h) return inApp ?? "direct";
  if (h.endsWith("dijivizit.com")) return "direct";
  if (h.includes("instagram")) return "instagram";
  if (h.includes("whatsapp") || h === "wa.me") return "whatsapp";
  if (h.includes("linkedin") || h === "lnkd.in") return "linkedin";
  if (h.includes("facebook") || h === "fb.com" || h === "m.me") return "facebook";
  if (h === "t.co" || h === "x.com" || h.includes("twitter")) return "x";
  if (/(^|\.)google\./.test(h)) return "google";
  if (h.includes("telegram") || h === "t.me") return "telegram";
  if (h.includes("mail")) return "email";
  return h.replace(/[^a-z0-9.-]/g, "").slice(0, 40) || "direct";
}
