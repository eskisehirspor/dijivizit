import { z } from "zod";

import { emailSchema } from "@/lib/validations/auth";

export const createInvitationSchema = z.object({
  email: z.union([z.literal(""), emailSchema]),
  maxUses: z.coerce
    .number({ error: "dashboard.invites.errors.maxUses" })
    .int({ error: "dashboard.invites.errors.maxUses" })
    .min(1, { error: "dashboard.invites.errors.maxUses" })
    .max(100, { error: "dashboard.invites.errors.maxUses" }),
  expiresAt: z.string().trim(),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;

/** Istanbul has been fixed at UTC+03:00 with no DST since 2016. */
const ISTANBUL_OFFSET = "+03:00";

/**
 * Turns the owner's form input into an ISO timestamp. Values without a zone
 * are read as Istanbul time (the server runs in UTC); a bare date means the end
 * of that day. Past moments are rejected.
 */
export function parseInvitationExpiry(
  value: string,
  now: Date = new Date(),
): string | null | { error: true } {
  if (value === "") {
    return null;
  }

  let candidate = value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    candidate = `${value}T23:59:59${ISTANBUL_OFFSET}`;
  } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value)) {
    candidate = `${value}${value.length === 16 ? ":00" : ""}${ISTANBUL_OFFSET}`;
  }

  const parsed = new Date(candidate);

  if (Number.isNaN(parsed.getTime()) || parsed.getTime() <= now.getTime()) {
    return { error: true };
  }

  return parsed.toISOString();
}
