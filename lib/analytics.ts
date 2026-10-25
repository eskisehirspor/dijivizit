/** Google Analytics 4 (dijivizit.com property). Loaded on the marketing site only. */
export const GA_MEASUREMENT_ID = "G-1VTQZXXCP3";

export const CONSENT_KEY = "dv-consent";

type Gtag = (...args: unknown[]) => void;

function gtag(...args: unknown[]) {
  const w = window as unknown as { gtag?: Gtag };
  w.gtag?.(...args);
}

/** Order request submitted: imported into Google Ads as the conversion. */
export function trackLead(finish: string) {
  gtag("event", "generate_lead", { finish, currency: "TRY" });
}

export function setConsent(granted: boolean) {
  const v = granted ? "granted" : "denied";
  gtag("consent", "update", {
    analytics_storage: v,
    ad_storage: v,
    ad_user_data: v,
    ad_personalization: v,
  });
}
