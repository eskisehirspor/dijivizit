import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/db/database.types";
import { clientEnv } from "@/lib/env/client";
import { serverEnv } from "@/lib/env/server";

/**
 * Service-role client. Bypasses RLS. Only for invitation writes/lookups that
 * cannot be expressed as a policy for anon or authenticated.
 */
export function createAdminClient() {
  return createClient<Database>(clientEnv.NEXT_PUBLIC_SUPABASE_URL, serverEnv.SUPABASE_SECRET_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
