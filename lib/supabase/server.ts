import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/lib/db/database.types";
import { clientEnv } from "@/lib/env/client";

// A new client per request: on the server it is essentially a configured fetch,
// and it has to carry this request's cookies.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components cannot write cookies. proxy.ts refreshes the
            // session on every matched request, so the write is already handled
            // there and losing it here is expected rather than an error.
          }
        },
      },
    },
  );
}
