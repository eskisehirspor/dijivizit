import "server-only";

import { notFound } from "next/navigation";

import { requireUser, type AuthenticatedUser } from "@/lib/dal/auth";
import { serverEnv } from "@/lib/env/server";
import { generateInvitationCode, hashInvitationCode } from "@/lib/invitations/code";
import { isInviteOwner, parseOwnerEmails, type InvitationRecord } from "@/lib/invitations/rules";
import { createAdminClient } from "@/lib/supabase/admin";

export type InvitationListItem = {
  id: string;
  email: string | null;
  maxUses: number;
  useCount: number;
  expiresAt: string | null;
  createdAt: string;
};

function ownerAllowlist(): string[] {
  return parseOwnerEmails(serverEnv.INVITE_OWNER_EMAILS);
}

export function viewerIsInviteOwner(email: string | null | undefined): boolean {
  return isInviteOwner(email, ownerAllowlist());
}

export async function requireInviteOwner(): Promise<AuthenticatedUser> {
  const user = await requireUser();

  if (!viewerIsInviteOwner(user.email)) {
    notFound();
  }

  return user;
}

export async function lookupInvitationByCode(code: string): Promise<InvitationRecord | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("invitation_codes")
    .select("email, max_uses, use_count, expires_at")
    .eq("code_hash", hashInvitationCode(code))
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    email: data.email,
    maxUses: data.max_uses,
    useCount: data.use_count,
    expiresAt: data.expires_at ? new Date(data.expires_at) : null,
  };
}

export async function listInvitationCodes(): Promise<InvitationListItem[]> {
  await requireInviteOwner();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("invitation_codes")
    .select("id, email, max_uses, use_count, expires_at, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    email: row.email,
    maxUses: row.max_uses,
    useCount: row.use_count,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  }));
}

export async function insertInvitationCode(input: {
  createdBy: string;
  email: string | null;
  maxUses: number;
  expiresAt: string | null;
}): Promise<{ plaintext: string } | { error: "failed" }> {
  const plaintext = generateInvitationCode();
  const supabase = createAdminClient();

  const { error } = await supabase.from("invitation_codes").insert({
    code_hash: hashInvitationCode(plaintext),
    email: input.email,
    max_uses: input.maxUses,
    expires_at: input.expiresAt,
    created_by: input.createdBy,
  });

  if (error) {
    return { error: "failed" };
  }

  return { plaintext };
}
