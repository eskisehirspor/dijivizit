import "server-only";

import { createClient as createStatelessClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/db/database.types";
import { clientEnv } from "@/lib/env/client";
import { AVATAR_BUCKET } from "@/lib/profile/avatar";
import { DOCUMENTS_BUCKET } from "@/lib/profile/documents";
import { routes } from "@/lib/routes";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import { requireUser } from "./auth";

export type AccountSummary = {
  email: string | null;
  pendingEmail: string | null;
  hasPassword: boolean;
  providers: string[];
};

export type AccountResult =
  | { ok: true }
  | {
      ok: false;
      code: "wrong_password" | "same_email" | "email_taken" | "rate_limited" | "weak" | "failed";
    };

export async function getOwnAccount(): Promise<AccountSummary> {
  await requireUser();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const providers = Array.isArray(user?.app_metadata?.providers)
    ? (user.app_metadata.providers as string[])
    : [];

  return {
    email: user?.email ?? null,
    pendingEmail: user?.new_email ?? null,
    hasPassword: providers.includes("email"),
    providers,
  };
}

function mapError(code: string | undefined): AccountResult {
  switch (code) {
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return { ok: false, code: "rate_limited" };
    case "email_exists":
    case "email_address_not_authorized":
      return { ok: false, code: "email_taken" };
    case "weak_password":
      return { ok: false, code: "weak" };
    case "same_password":
      return { ok: false, code: "failed" };
    default:
      return { ok: false, code: "failed" };
  }
}

/**
 * Checks a password without touching the caller's session cookies: a separate
 * client that never persists anything signs in and is discarded.
 */
async function passwordMatches(email: string, password: string): Promise<boolean> {
  const probe = createStatelessClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { error } = await probe.auth.signInWithPassword({ email, password });
  if (!error) {
    await probe.auth.signOut({ scope: "local" });
  }
  return !error;
}

/**
 * Changes the password. Accounts that already have one must confirm it; Google
 * accounts without a password can set one here.
 */
export async function changeOwnPassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<AccountResult> {
  const account = await getOwnAccount();

  if (account.hasPassword) {
    if (!account.email || !(await passwordMatches(account.email, input.currentPassword))) {
      return { ok: false, code: "wrong_password" };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: input.newPassword });

  return error ? mapError(error.code) : { ok: true };
}

/** Starts an email change; Supabase mails a confirmation link to the new address. */
export async function changeOwnEmail(email: string): Promise<AccountResult> {
  const account = await getOwnAccount();

  if (account.email?.toLowerCase() === email.toLowerCase()) {
    return { ok: false, code: "same_email" };
  }

  const supabase = await createClient();
  const redirectTo = new URL(routes.authCallback, clientEnv.NEXT_PUBLIC_SITE_URL);
  redirectTo.searchParams.set("next", routes.settings);

  const { error } = await supabase.auth.updateUser(
    { email },
    { emailRedirectTo: redirectTo.toString() },
  );

  return error ? mapError(error.code) : { ok: true };
}

async function removeFolder(bucket: string, folder: string): Promise<void> {
  const admin = createAdminClient();

  for (;;) {
    const { data, error } = await admin.storage.from(bucket).list(folder, { limit: 100 });
    if (error || !data || data.length === 0) {
      return;
    }

    const { error: removeError } = await admin.storage
      .from(bucket)
      .remove(data.map((object) => `${folder}/${object.name}`));

    if (removeError || data.length < 100) {
      return;
    }
  }
}

/**
 * Permanently deletes the caller's account (KVKK right to erasure). Storage
 * objects are removed first; deleting the auth user then cascades to the
 * profile, links, skills, documents, bank, billing, analytics and redemptions.
 */
export async function deleteOwnAccount(): Promise<AccountResult> {
  const user = await requireUser();

  await removeFolder(AVATAR_BUCKET, user.id);
  await removeFolder(DOCUMENTS_BUCKET, user.id);

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return { ok: false, code: "failed" };
  }

  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });

  return { ok: true };
}
