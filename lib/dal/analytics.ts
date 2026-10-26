import "server-only";

import { cache } from "react";

import { requireUser } from "@/lib/dal/auth";
import { createClient } from "@/lib/supabase/server";
import { isValidPublicId } from "@/lib/utils/public-id";
import {
  type AnalyticsEventType,
  type AnalyticsDetail,
  type AnalyticsSummary,
  EMPTY_ANALYTICS_SUMMARY,
  analyticsDetailSchema,
  analyticsSummarySchema,
} from "@/lib/validations/analytics";
import { sourceFromReferrer, visitContext } from "@/lib/analytics/request-context";

/**
 * Records a public-card analytics event via the security-definer RPC.
 * Resolves public_id → profile_id in the database; never accepts a profile uuid.
 * Failures are swallowed at the call site — analytics must not block UX.
 */
export async function recordCardEvent(input: {
  publicId: string;
  eventType: AnalyticsEventType;
  visitorId?: string | null;
  /** Referring host from the visitor's browser; profile views only. */
  referrerHost?: string | null;
}): Promise<boolean> {
  if (!isValidPublicId(input.publicId)) {
    return false;
  }

  const ctx = await visitContext().catch(() => null);
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("record_card_event", {
    p_public_id: input.publicId,
    p_event_type: input.eventType,
    ...(input.visitorId ? { p_visitor_id: input.visitorId } : {}),
    ...(ctx?.country ? { p_country: ctx.country } : {}),
    ...(ctx?.city ? { p_city: ctx.city } : {}),
    ...(ctx?.device ? { p_device: ctx.device } : {}),
    ...(input.eventType === "profile_view"
      ? { p_source: sourceFromReferrer(input.referrerHost, ctx?.inApp ?? null) }
      : {}),
  });

  if (error) {
    return false;
  }

  return data === true;
}

export const getOwnAnalyticsSummary = cache(async (): Promise<AnalyticsSummary> => {
  await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_own_analytics_summary");

  if (error || data === null) {
    return EMPTY_ANALYTICS_SUMMARY;
  }

  const parsed = analyticsSummarySchema.safeParse(data);
  return parsed.success ? parsed.data : EMPTY_ANALYTICS_SUMMARY;
});

/** Charts for the analytics page over the last `days` days (Istanbul time). */
export async function getOwnAnalyticsDetail(days: number): Promise<AnalyticsDetail | null> {
  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_own_analytics_detail", { p_days: days });
  if (error || data === null) return null;
  const parsed = analyticsDetailSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}
