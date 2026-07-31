"use server";

import { recordCardEvent } from "@/lib/dal/analytics";
import { trackAnalyticsEventSchema } from "@/lib/validations/analytics";

/**
 * Fire-and-forget public analytics. Always resolves; never throws to the client.
 * Callers should not await in a way that blocks navigation (void is fine).
 */
export async function trackAnalyticsEventAction(input: {
  publicId: string;
  eventType: string;
  visitorId?: string | null;
}): Promise<void> {
  const parsed = trackAnalyticsEventSchema.safeParse(input);
  if (!parsed.success) {
    return;
  }

  try {
    await recordCardEvent({
      publicId: parsed.data.publicId,
      eventType: parsed.data.eventType,
      visitorId: parsed.data.visitorId ?? null,
    });
  } catch {
    // Intentionally ignored — analytics must not surface errors in the UI.
  }
}
