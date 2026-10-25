import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  // Full-access key that bypasses row-level security. Only for administrative
  // work that cannot be expressed as a policy; never for request-scoped reads.
  SUPABASE_SECRET_KEY: z.string().min(1),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  // Comma-separated emails allowed to create invitation codes. Empty means nobody.
  INVITE_OWNER_EMAILS: z.string().default(""),
  // Resend key for invitation emails. Optional: without it codes are still
  // created and shown to the owner, just not mailed.
  RESEND_API_KEY: z.string().optional(),
  // Reads paper business cards (Claude vision). Optional: scanning is off without it.
  ANTHROPIC_API_KEY: z.string().optional(),
  // Apple Wallet pass signing. Optional: the Wallet button is hidden without them.
  APPLE_PASS_TYPE_ID: z.string().optional(),
  APPLE_TEAM_ID: z.string().optional(),
  APPLE_PASS_CERT: z.string().optional(),
  APPLE_PASS_KEY: z.string().optional(),
  APPLE_WWDR_CERT: z.string().optional(),
});

const parsed = serverEnvSchema.safeParse({
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  NODE_ENV: process.env.NODE_ENV,
  INVITE_OWNER_EMAILS: process.env.INVITE_OWNER_EMAILS,
  RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || undefined,
  APPLE_PASS_TYPE_ID: process.env.APPLE_PASS_TYPE_ID || undefined,
  APPLE_TEAM_ID: process.env.APPLE_TEAM_ID || undefined,
  APPLE_PASS_CERT: process.env.APPLE_PASS_CERT || undefined,
  APPLE_PASS_KEY: process.env.APPLE_PASS_KEY || undefined,
  APPLE_WWDR_CERT: process.env.APPLE_WWDR_CERT || undefined,
});

if (!parsed.success) {
  throw new Error(`Invalid server environment variables:\n${z.prettifyError(parsed.error)}`);
}

export const serverEnv = parsed.data;
