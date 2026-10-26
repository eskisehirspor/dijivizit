/** Google Analytics 4 (dijivizit.com property). Loaded on the marketing site only. */
export const GA_MEASUREMENT_ID = "G-1VTQZXXCP3";

/**
 * Meta Pixel (Facebook / Instagram ads). Loaded on the marketing site only,
 * and only after the visitor accepts the cookie banner. Empty = off.
 */
export const META_PIXEL_ID = "1670397451141495"; // "Dijivizit Yayinci" dataset

// Bumped when the list of tools changes, so earlier answers are asked again.
export const CONSENT_KEY = "dv-consent-2";

type Gtag = (...args: unknown[]) => void;

function gtag(...args: unknown[]) {
  const w = window as unknown as { gtag?: Gtag };
  w.gtag?.(...args);
}

type Fbq = (...args: unknown[]) => void;

function fbq(...args: unknown[]) {
  const w = window as unknown as { fbq?: Fbq };
  w.fbq?.(...args);
}

/** Order request submitted: the Google Ads and Meta conversion. */
export function trackLead(finish: string) {
  gtag("event", "generate_lead", { finish, currency: "TRY" });
  fbq("track", "Lead", { content_name: finish });
}

/** Loads the Meta Pixel and records the page view; a no-op without an ID. */
export function loadMetaPixel() {
  if (!META_PIXEL_ID) return;
  const w = window as unknown as { fbq?: Fbq & { loaded?: boolean } };
  if (w.fbq) return;
  /* eslint-disable */
  // Meta's standard base code, unminified.
  const n: any = function (...args: unknown[]) {
    n.callMethod ? n.callMethod(...args) : n.queue.push(args);
  };
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  (window as any).fbq = n;
  (window as any)._fbq = n;
  /* eslint-enable */
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  fbq("init", META_PIXEL_ID);
  fbq("track", "PageView");
}

/** Client-side navigation inside the marketing site. */
export function trackPageView() {
  fbq("track", "PageView");
}

export function setConsent(granted: boolean) {
  if (granted) loadMetaPixel();
  const v = granted ? "granted" : "denied";
  gtag("consent", "update", {
    analytics_storage: v,
    ad_storage: v,
    ad_user_data: v,
    ad_personalization: v,
  });
}
