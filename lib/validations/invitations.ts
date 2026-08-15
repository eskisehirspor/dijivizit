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

export function parseInvitationExpiry(value: string): string | null | { error: true } {
  if (value === "") {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return { error: true };
  }

  return parsed.toISOString();
}
