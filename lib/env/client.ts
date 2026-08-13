import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  // Application origin. Production: https://app.dijivizit.com — OAuth, email
  // confirmation, password reset, public card URLs, and marketing CTAs.
  NEXT_PUBLIC_SITE_URL: z.url(),
});

// Next.js only inlines `process.env.NEXT_PUBLIC_*` for literal member expressions,
// so each key has to be spelled out here rather than iterated over.
const parsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsed.success) {
  throw new Error(`Invalid client environment variables:\n${z.prettifyError(parsed.error)}`);
}

export const clientEnv = parsed.data;
