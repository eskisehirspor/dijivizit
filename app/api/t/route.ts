import { z } from "zod";

import { sourceFromReferrer, visitContext } from "@/lib/analytics/request-context";
import { createAdminClient } from "@/lib/supabase/admin";

const EVENT_TYPES = [
  "pageview",
  "view_item",
  "begin_checkout",
  "generate_lead",
  "tool_start",
  "qr_download",
  "tool_offer_click",
] as const;

const schema = z.object({
  type: z.enum(EVENT_TYPES),
  path: z
    .string()
    .max(200)
    .regex(/^\/[^\s]*$/),
  item: z.string().max(40).optional(),
  ref: z.string().max(200).optional(),
  session: z
    .string()
    .regex(/^[a-z0-9]{8,40}$/)
    .optional(),
});

/**
 * First-party, cookie-free site analytics (sendBeacon from the marketing
 * site). Stores the path, a coarse source, country and device type; no IP and
 * no persistent visitor id. Always answers 204 so it never affects the page.
 */
export async function POST(request: Request) {
  try {
    const ua = request.headers.get("user-agent") ?? "";
    if (/bot|crawl|spider|slurp|preview|headless/i.test(ua))
      return new Response(null, { status: 204 });
    const parsed = schema.safeParse(JSON.parse(await request.text()));
    if (!parsed.success) return new Response(null, { status: 204 });
    const e = parsed.data;
    const ctx = await visitContext();
    let refHost: string | null = null;
    try {
      refHost = e.ref ? new URL(e.ref).hostname : null;
    } catch {
      refHost = null;
    }
    const device =
      ctx.device === "ios" || ctx.device === "android"
        ? /iPad|Tablet/i.test(ua)
          ? "tablet"
          : "mobile"
        : ctx.device === "desktop"
          ? "desktop"
          : null;
    await createAdminClient()
      .from("site_events")
      .insert({
        type: e.type,
        path: e.path.split("?")[0]!.slice(0, 200),
        item: e.item ?? null,
        ref_host: sourceFromReferrer(refHost, ctx.inApp),
        country: ctx.country,
        device,
        session: e.session ?? null,
      });
  } catch {
    // analytics must never fail a page
  }
  return new Response(null, { status: 204 });
}
