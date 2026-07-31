import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";

export type AuthenticatedUser = {
  id: string;
  email: string | null;
};

type AuthUserRecord = AuthenticatedUser & {
  emailConfirmed: boolean;
};

/**
 * The authorization boundary. proxy.ts refreshes sessions and redirects, but it
 * does not reliably cover Server Actions, so every entry point that touches
 * private data goes through here.
 *
 * Uses getUser() (not getClaims) so email_confirmed_at is available for the
 * verification gate. Wrapped in React `cache` so repeated calls within one
 * render resolve once.
 */
const getAuthUserRecord = cache(async (): Promise<AuthUserRecord | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
    emailConfirmed: Boolean(user.email_confirmed_at),
  };
});

export const getAuthenticatedUser = cache(async (): Promise<AuthenticatedUser | null> => {
  const user = await getAuthUserRecord();

  if (!user) {
    return null;
  }

  return { id: user.id, email: user.email };
});

export async function requireUser(): Promise<AuthenticatedUser> {
  const user = await getAuthUserRecord();

  if (!user) {
    redirect(routes.login);
  }

  if (!user.emailConfirmed) {
    const path = user.email
      ? `${routes.verifyEmail}?email=${encodeURIComponent(user.email)}`
      : routes.verifyEmail;
    redirect(path);
  }

  return { id: user.id, email: user.email };
}
