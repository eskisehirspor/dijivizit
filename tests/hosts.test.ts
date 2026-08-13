import { describe, expect, it } from "vitest";

import {
  APP_ORIGIN,
  appOriginUrl,
  isAppHostname,
  isMarketingHostname,
  joinOriginPath,
  shouldPassThroughOnMarketingHost,
} from "@/lib/hosts";

describe("host split", () => {
  it("recognises the production marketing and app hosts", () => {
    expect(isMarketingHostname("dijivizit.com")).toBe(true);
    expect(isMarketingHostname("www.dijivizit.com")).toBe(true);
    expect(isMarketingHostname("app.dijivizit.com")).toBe(false);
    expect(isMarketingHostname("localhost")).toBe(false);

    expect(isAppHostname("app.dijivizit.com")).toBe(true);
    expect(isAppHostname("dijivizit.com")).toBe(false);
    expect(isAppHostname("localhost")).toBe(false);
  });

  it("keeps the landing page, auth callbacks, and public cards on the marketing host", () => {
    expect(shouldPassThroughOnMarketingHost("/")).toBe(true);
    expect(shouldPassThroughOnMarketingHost("/auth/callback")).toBe(true);
    expect(shouldPassThroughOnMarketingHost("/auth/confirm")).toBe(true);
    expect(shouldPassThroughOnMarketingHost("/p/AbCdEfGh123")).toBe(true);
    expect(shouldPassThroughOnMarketingHost("/p/AbCdEfGh123/vcard")).toBe(true);

    expect(shouldPassThroughOnMarketingHost("/login")).toBe(false);
    expect(shouldPassThroughOnMarketingHost("/register")).toBe(false);
    expect(shouldPassThroughOnMarketingHost("/dashboard")).toBe(false);
    expect(shouldPassThroughOnMarketingHost("/profile/edit")).toBe(false);
  });

  it("preserves path and query when building an app URL", () => {
    expect(appOriginUrl("/login", "?next=%2Fdashboard").toString()).toBe(
      `${APP_ORIGIN}/login?next=%2Fdashboard`,
    );
    expect(appOriginUrl("/register").toString()).toBe(`${APP_ORIGIN}/register`);
  });

  it("joins an origin and path without a double slash", () => {
    expect(joinOriginPath("https://app.dijivizit.com/", "/login")).toBe(
      "https://app.dijivizit.com/login",
    );
    expect(joinOriginPath("https://app.dijivizit.com", "/register")).toBe(
      "https://app.dijivizit.com/register",
    );
  });
});
