"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

import { CONSENT_KEY, GA_MEASUREMENT_ID, setConsent } from "@/lib/analytics";

/**
 * GA4 with Google Consent Mode v2: everything starts denied, so no analytics
 * or advertising cookies are set until the visitor accepts in the banner.
 */
export function Analytics() {
  const [choice, setChoice] = useState<"granted" | "denied" | "unset" | null>(null);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(CONSENT_KEY);
    } catch {}
    const value = stored === "granted" || stored === "denied" ? stored : "unset";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only storage once on mount
    setChoice(value);
    if (value === "granted") setConsent(true);
  }, []);

  function decide(granted: boolean) {
    try {
      localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
    } catch {}
    setConsent(granted);
    setChoice(granted ? "granted" : "denied");
  }

  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      {choice === "unset" && (
        <div
          role="dialog"
          aria-label="Çerez tercihi"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl flex-col gap-4 rounded-2xl border border-border/60 bg-background/95 p-5 text-sm shadow-lg backdrop-blur sm:flex-row sm:items-center"
        >
          <p className="flex-1 leading-relaxed text-muted-foreground">
            Siteyi geliştirmek ve reklamlarımızın sonucunu ölçmek için Google Analytics çerezleri
            kullanmak istiyoruz.{" "}
            <Link
              href="/yasal/gizlilik"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Ayrıntılar
            </Link>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => decide(false)}
              className="h-10 rounded-full border border-border px-4 font-medium transition-colors hover:bg-muted"
            >
              Reddet
            </button>
            <button
              type="button"
              onClick={() => decide(true)}
              className="h-10 rounded-full bg-neutral-950 px-4 font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Kabul et
            </button>
          </div>
        </div>
      )}
    </>
  );
}
