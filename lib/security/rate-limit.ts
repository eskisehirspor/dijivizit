import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";

type Limiter = { limit: (options: { key: string }) => Promise<{ success: boolean }> };

/**
 * Cloudflare Workers rate limiting (wrangler.jsonc `ratelimits` bindings).
 * Fails open: outside Workers (local dev, tests) or if the binding is missing,
 * the request is allowed, so a limiter outage never blocks real customers.
 */
export async function allowRequest(
  binding: "FORM_LIMITER" | "CARD_LIMITER",
  key: string,
): Promise<boolean> {
  try {
    const { env } = getCloudflareContext();
    const limiter = (env as unknown as Record<string, Limiter | undefined>)[binding];
    if (!limiter) return true;
    const { success } = await limiter.limit({ key });
    return success;
  } catch {
    return true;
  }
}

/** The visitor's IP as Cloudflare saw it, or a constant when unknown. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
