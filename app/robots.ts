import type { MetadataRoute } from "next";
import { headers } from "next/headers";

import { isAppHostname, MARKETING_ORIGIN } from "@/lib/hosts";

/**
 * dijivizit.com is the public, indexable site. app.dijivizit.com is the
 * signed-in application and stays out of search results entirely.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host")?.split(":")[0] ?? "";

  if (isAppHostname(host)) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/p/", "/auth/"] },
    sitemap: `${MARKETING_ORIGIN}/sitemap.xml`,
    host: MARKETING_ORIGIN,
  };
}
