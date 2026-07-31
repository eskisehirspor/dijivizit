"use client";

import { useEffect } from "react";

import { trackAnalyticsEventAction } from "@/app/actions/analytics";
import { getOrCreateVisitorId } from "@/lib/analytics/visitor-id";

/** Records a single profile_view after mount. Does not block rendering. */
export function TrackProfileView({ publicId }: { publicId: string }) {
  useEffect(() => {
    void trackAnalyticsEventAction({
      publicId,
      eventType: "profile_view",
      visitorId: getOrCreateVisitorId(),
    });
  }, [publicId]);

  return null;
}
