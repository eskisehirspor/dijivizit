import { describe, expect, it } from "vitest";

import {
  eventTypeForContactPlatform,
  trackAnalyticsEventSchema,
} from "@/lib/validations/analytics";

describe("eventTypeForContactPlatform", () => {
  it("maps tracked contact platforms", () => {
    expect(eventTypeForContactPlatform("phone")).toBe("phone_click");
    expect(eventTypeForContactPlatform("whatsapp")).toBe("whatsapp_click");
    expect(eventTypeForContactPlatform("email")).toBe("email_click");
    expect(eventTypeForContactPlatform("website")).toBe("website_click");
    expect(eventTypeForContactPlatform("linkedin")).toBe("linkedin_click");
    expect(eventTypeForContactPlatform("address")).toBe("address_open");
  });

  it("ignores untracked platforms", () => {
    expect(eventTypeForContactPlatform("instagram")).toBeNull();
    expect(eventTypeForContactPlatform("x")).toBeNull();
  });
});

describe("trackAnalyticsEventSchema", () => {
  it("accepts a valid public event payload", () => {
    const parsed = trackAnalyticsEventSchema.safeParse({
      publicId: "abcdefghijk",
      eventType: "profile_view",
      visitorId: "visitor-1",
    });

    expect(parsed.success).toBe(true);
  });

  it("accepts share analytics event types", () => {
    for (const eventType of ["share", "copy_link", "qr_open"] as const) {
      expect(
        trackAnalyticsEventSchema.safeParse({
          publicId: "abcdefghijk",
          eventType,
        }).success,
      ).toBe(true);
    }
  });

  it("rejects unknown event types and bad public ids", () => {
    expect(
      trackAnalyticsEventSchema.safeParse({
        publicId: "abcdefghijk",
        eventType: "not_an_event",
      }).success,
    ).toBe(false);

    expect(
      trackAnalyticsEventSchema.safeParse({
        publicId: "short",
        eventType: "profile_view",
      }).success,
    ).toBe(false);
  });
});
