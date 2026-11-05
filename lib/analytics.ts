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

type SiteEvent =
  | "pageview"
  | "view_item"
  | "begin_checkout"
  | "generate_lead"
  | "tool_start"
  | "qr_download"
  | "tool_offer_click";

/** Random per-tab id (sessionStorage), so the dashboard can count visits. */
function sessionId(): string | undefined {
  try {
    let id = sessionStorage.getItem("dv-s");
    if (!id) {
      id = Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
      sessionStorage.setItem("dv-s", id);
    }
    return id;
  } catch {
    return undefined;
  }
}

/**
 * First-party, cookie-free event for the owner dashboard (/api/t). Sent for
 * every visitor; holds no personal data.
 */
export function siteEvent(type: SiteEvent, item?: string) {
  try {
    const body = JSON.stringify({
      type,
      path: location.pathname,
      item,
      ref: type === "pageview" && document.referrer ? document.referrer : undefined,
      session: sessionId(),
    });
    if (!navigator.sendBeacon?.("/api/t", body)) {
      void fetch("/api/t", { method: "POST", body, keepalive: true });
    }
  } catch {
    // never break the page
  }
}

type Item = { id: string; name: string; price: number };

function ga4Items(item: Item, quantity = 1) {
  return [{ item_id: item.id, item_name: item.name, price: item.price, quantity }];
}

/** A product page was viewed. */
export function trackViewItem(item: Item) {
  siteEvent("view_item", item.id);
  gtag("event", "view_item", { currency: "TRY", value: item.price, items: ga4Items(item) });
  fbq("track", "ViewContent", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    value: item.price,
    currency: "TRY",
  });
}

/** The visitor started filling in the order form. */
export function trackBeginCheckout(item: Item) {
  siteEvent("begin_checkout", item.id);
  gtag("event", "begin_checkout", { currency: "TRY", value: item.price, items: ga4Items(item) });
  fbq("track", "InitiateCheckout", {
    content_ids: [item.id],
    value: item.price,
    currency: "TRY",
  });
}

/** Order request submitted: the Google Ads and Meta conversion. `value` is the order total. */
export function trackLead(item: Item, quantity: number, value: number) {
  siteEvent("generate_lead", item.id);
  gtag("event", "generate_lead", {
    finish: item.id,
    currency: "TRY",
    value,
    items: ga4Items(item, quantity),
  });
  fbq("track", "Lead", { content_name: item.id, value, currency: "TRY" });
}

type ToolStep = "tool_start" | "qr_download" | "signature_copy" | "tool_offer_click";

/**
 * Free tool funnel: started typing, took the result (QR download, signature
 * copy), clicked the paid offer. The first-party log has one "result" type
 * (qr_download, constrained in the site_events table), so other result steps
 * are stored under it; the tool slug in `item` tells them apart. GA and Meta
 * get the real step name.
 */
export function trackTool(tool: string, step: ToolStep) {
  siteEvent(step === "signature_copy" ? "qr_download" : step, tool.slice(0, 40));
  gtag("event", step, { tool });
  fbq("trackCustom", step, { tool });
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
