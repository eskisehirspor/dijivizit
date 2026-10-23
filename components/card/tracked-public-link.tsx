"use client";

import type { ReactNode } from "react";

import { trackAnalyticsEventAction } from "@/app/actions/analytics";
import { getOrCreateVisitorId } from "@/lib/analytics/visitor-id";
import { eventTypeForContactPlatform } from "@/lib/validations/analytics";
import { cn } from "@/lib/utils";

type TrackedPublicLinkProps = {
  publicId: string;
  platform: string;
  href: string;
  external: boolean;
  /** False on the owner's draft preview, so previews never inflate stats. */
  track?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Public contact row that records a click event without waiting on the network.
 * Navigation proceeds immediately; tracking runs in the background.
 */
export function TrackedPublicLink({
  publicId,
  platform,
  href,
  external,
  track = true,
  className,
  children,
}: TrackedPublicLinkProps) {
  const eventType = track ? eventTypeForContactPlatform(platform) : null;

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(className)}
      onClick={() => {
        if (!eventType) {
          return;
        }

        void trackAnalyticsEventAction({
          publicId,
          eventType,
          visitorId: getOrCreateVisitorId(),
        });
      }}
    >
      {children}
    </a>
  );
}
