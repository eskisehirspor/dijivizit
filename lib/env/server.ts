import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  // Full-access key that bypasses row-level security. Only for administrative
  // work that cannot be expressed as a policy; never for request-scoped reads.
  SUPABASE_SECRET_KEY: z.string().min(1),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  // Comma-separated emails allowed to create invitation codes. Empty means nobody.
  INVITE_OWNER_EMAILS: z.string().default(""),
});

const parsed = serverEnvSchema.safeParse({
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  NODE_ENV: process.env.NODE_ENV,
  INVITE_OWNER_EMAILS: process.env.INVITE_OWNER_EMAILS,
});

if (!parsed.success) {
  throw new Error(`Invalid server environment variables:\n${z.prettifyError(parsed.error)}`);
}

export const serverEnv = parsed.data;
