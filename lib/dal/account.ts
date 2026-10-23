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
    // Setting a password on a Google account doesn't add the "email" provider,
    // so that case is recorded in app_metadata by changeOwnPassword.
    hasPassword: providers.includes("email") || user?.app_metadata?.has_password === true,
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
async function checkPassword(
  email: string,
  password: string,
): Promise<"ok" | "wrong" | "unavailable"> {
  const probe = createStatelessClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { error } = await probe.auth.signInWithPassword({ email, password });
  if (!error) {
    await probe.auth.signOut({ scope: "local" });
    return "ok";
  }

  // Only a credentials error means the password is wrong; rate limits and
  // outages must not be reported as one.
  return error.code === "invalid_credentials" ? "wrong" : "unavailable";
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
    if (!account.email) {
      return { ok: false, code: "failed" };
    }
    const check = await checkPassword(account.email, input.currentPassword);
    if (check === "wrong") {
      return { ok: false, code: "wrong_password" };
    }
    if (check === "unavailable") {
      return { ok: false, code: "rate_limited" };
    }
  }

  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: input.newPassword });

  if (error) {
    return mapError(error.code);
  }

  if (!account.hasPassword) {
    // From now on the current password is required to change it.
    await createAdminClient().auth.admin.updateUserById(user.id, {
      app_metadata: { has_password: true },
    });
  }

  return { ok: true };
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

async function removeFolder(bucket: string, folder: string): Promise<boolean> {
  const admin = createAdminClient();

  for (;;) {
    const { data, error } = await admin.storage.from(bucket).list(folder, { limit: 100 });
    if (error) {
      return false;
    }
    if (!data || data.length === 0) {
      return true;
    }

    const { error: removeError } = await admin.storage
      .from(bucket)
      .remove(data.map((object) => `${folder}/${object.name}`));

    if (removeError) {
      return false;
    }
  }
}

/**
 * Permanently deletes the caller's account (KVKK right to erasure).
 *
 * The auth user goes first: if that fails nothing is lost and the user can
 * retry. Its deletion cascades to the profile, links, skills, documents rows,
 * bank, billing, analytics and redemptions. Storage objects are then purged
 * with the service role; leftovers are logged for manual cleanup rather than
 * leaving the account half-deleted.
 */
export async function deleteOwnAccount(): Promise<AccountResult> {
  const user = await requireUser();
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return { ok: false, code: "failed" };
  }

  const [avatarsOk, documentsOk] = await Promise.all([
    removeFolder(AVATAR_BUCKET, user.id),
    removeFolder(DOCUMENTS_BUCKET, user.id),
  ]);

  if (!avatarsOk || !documentsOk) {
    console.error("Account deleted but storage cleanup incomplete", {
      userId: user.id,
      avatarsOk,
      documentsOk,
    });
  }

  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });

  return { ok: true };
}
