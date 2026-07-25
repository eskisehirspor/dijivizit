import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";

export type AuthenticatedUser = {
  id: string;
  email: string | null;
};

/**
 * The authorization boundary. proxy.ts refreshes sessions and redirects, but it
 * does not reliably cover Server Actions, so every entry point that touches
 * private data goes through here.
 *
 * Wrapped in React `cache` so repeated calls within one render resolve once.
 */
export const getAuthenticatedUser = cache(async (): Promise<AuthenticatedUser | null> => {
  const supabase = await createClient();

  // getClaims verifies the JWT signature; getSession would only read a
  // client-controlled cookie.
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  return {
    id: data.claims.sub,
    email: typeof data.claims.email === "string" ? data.claims.email : null,
  };
});

export async function requireUser(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(routes.login);
  }

  return user;
}
