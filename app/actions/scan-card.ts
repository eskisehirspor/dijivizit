"use server";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { parseScanResponse, SCAN_PROMPT, type ScannedCard } from "@/lib/contacts/scan";
import { requireUser } from "@/lib/dal/auth";
import { serverEnv } from "@/lib/env/server";
import { allowRequest } from "@/lib/security/rate-limit";

const MODEL = "claude-haiku-5-5";
const MAX_BASE64 = 950_000; // server actions accept ~1 MB; the client downsizes to 1400px JPEG

/** Reads a business card photo. The image is sent to the model and not stored. */
export async function scanCardAction(dataUrl: string): Promise<ActionResult<ScannedCard>> {
  const user = await requireUser();
  if (!serverEnv.ANTHROPIC_API_KEY) return failure("scan.errors.unavailable");
  if (!(await allowRequest("FORM_LIMITER", `scan:${user.id}`))) {
    return failure("scan.errors.rateLimited");
  }

  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl));
  if (!m || m[2]!.length > MAX_BASE64) return failure("scan.errors.image");

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": serverEnv.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 600,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: m[1], data: m[2] } },
              { type: "text", text: SCAN_PROMPT },
            ],
          },
        ],
      }),
    });
    if (!res.ok) {
      console.error("Card scan failed:", res.status);
      return failure("scan.errors.failed");
    }
    const body = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = body.content?.find((c) => c.type === "text")?.text ?? "";
    const card = parseScanResponse(text);
    if (!card.fullName && !card.phone && !card.email) return failure("scan.errors.nothing");
    return success(card);
  } catch (error) {
    console.error("Card scan failed:", error);
    return failure("scan.errors.failed");
  }
}
