import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/lib/db/database.types";
import { clientEnv } from "@/lib/env/client";

/**
 * Refreshes the Supabase session for a request and reports who the caller is.
 *
 * Must run before a response is committed, otherwise a token refreshed mid-request
 * cannot be written back and the user gets signed out when the old token expires.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }

          response = NextResponse.next({ request });

          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }

          // Cache-Control/Expires/Pragma. Without them a CDN or reverse proxy can
          // cache a response that carries a refreshed auth cookie and hand one
          // user's session to the next visitor.
          for (const [key, value] of Object.entries(headers)) {
            response.headers.set(key, value);
          }
        },
      },
    },
  );

  // getClaims verifies the JWT signature on every call. getSession only reads
  // the cookie, which the client controls, so it must never gate access here.
  const { data } = await supabase.auth.getClaims();

  return { response, claims: data?.claims ?? null };
}
