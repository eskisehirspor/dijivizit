import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/db/database.types";
import { clientEnv } from "@/lib/env/client";

// createBrowserClient is internally memoised, so calling this per component is
// cheap and does not create duplicate connections.
export function createClient() {
  return createBrowserClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
