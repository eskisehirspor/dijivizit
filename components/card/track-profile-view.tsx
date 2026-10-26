"use client";

import { useEffect } from "react";

import { trackAnalyticsEventAction } from "@/app/actions/analytics";
import { getOrCreateVisitorId } from "@/lib/analytics/visitor-id";

function referrerHost(): string | null {
  try {
    return document.referrer ? new URL(document.referrer).hostname : null;
  } catch {
    return null;
  }
}

/** Records a single profile_view after mount. Does not block rendering. */
export function TrackProfileView({ publicId }: { publicId: string }) {
  useEffect(() => {
    void trackAnalyticsEventAction({
      publicId,
      eventType: "profile_view",
      visitorId: getOrCreateVisitorId(),
      referrerHost: referrerHost(),
    });
  }, [publicId]);

  return null;
}
