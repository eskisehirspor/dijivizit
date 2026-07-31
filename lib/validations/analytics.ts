import { z } from "zod";

import { isValidPublicId } from "@/lib/utils/public-id";

export const ANALYTICS_EVENT_TYPES = [
  "profile_view",
  "phone_click",
  "whatsapp_click",
  "email_click",
  "website_click",
  "linkedin_click",
  "cv_open",
  "document_open",
  "vcard_download",
  "address_open",
  "share",
  "copy_link",
  "qr_open",
] as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

export const analyticsEventTypeSchema = z.enum(ANALYTICS_EVENT_TYPES);

export const trackAnalyticsEventSchema = z.object({
  publicId: z.string().refine(isValidPublicId, { message: "invalid_public_id" }),
  eventType: analyticsEventTypeSchema,
  visitorId: z.string().trim().min(1).max(64).nullable().optional(),
});

export type TrackAnalyticsEventInput = z.infer<typeof trackAnalyticsEventSchema>;

/** Platforms on the public card that map to a tracked click/open event. */
export const TRACKED_CONTACT_PLATFORMS = [
  "phone",
  "whatsapp",
  "email",
  "website",
  "linkedin",
  "address",
] as const;

export type TrackedContactPlatform = (typeof TRACKED_CONTACT_PLATFORMS)[number];

const PLATFORM_TO_EVENT = {
  phone: "phone_click",
  whatsapp: "whatsapp_click",
  email: "email_click",
  website: "website_click",
  linkedin: "linkedin_click",
  address: "address_open",
} as const satisfies Record<TrackedContactPlatform, AnalyticsEventType>;

export function eventTypeForContactPlatform(platform: string): AnalyticsEventType | null {
  if (!(platform in PLATFORM_TO_EVENT)) {
    return null;
  }

  return PLATFORM_TO_EVENT[platform as TrackedContactPlatform];
}

export const analyticsSummarySchema = z.object({
  profileViewsTotal: z.number().int().nonnegative(),
  profileViewsToday: z.number().int().nonnegative(),
  profileViewsWeek: z.number().int().nonnegative(),
  profileViewsMonth: z.number().int().nonnegative(),
  byType: z.record(z.string(), z.number().int().nonnegative()),
});

export type AnalyticsSummary = z.infer<typeof analyticsSummarySchema>;

export const EMPTY_ANALYTICS_SUMMARY: AnalyticsSummary = {
  profileViewsTotal: 0,
  profileViewsToday: 0,
  profileViewsWeek: 0,
  profileViewsMonth: 0,
  byType: {},
};
