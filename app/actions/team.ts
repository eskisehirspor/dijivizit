"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { requireUser } from "@/lib/dal/auth";
import { insertInvitationCode } from "@/lib/dal/invitations";
import { getOwnProfile } from "@/lib/dal/profile";
import {
  acceptTeamInvite,
  createTeam,
  createTeamInvite,
  deleteTeam,
  listMyTeams,
  removeMember,
  renameTeam,
  revokeTeamInvite,
  setMemberRole,
} from "@/lib/dal/team";
import { buildTeamInviteEmail } from "@/lib/email/team";
import { CONTACT_EMAIL_FROM } from "@/lib/email/contact";
import { serverEnv } from "@/lib/env/server";
import { APP_ORIGIN, MARKETING_ORIGIN } from "@/lib/hosts";
import { routes } from "@/lib/routes";
import { allowRequest } from "@/lib/security/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

const id = z.uuid();
const teamName = z
  .string()
  .trim()
  .min(2, { error: "team.errors.name" })
  .max(120, { error: "team.errors.name" });

function refresh() {
  revalidatePath(routes.team);
  revalidatePath(routes.cards);
  revalidatePath(routes.dashboard);
}

async function adminTeam(orgId: string) {
  const teams = await listMyTeams();
  const team = teams.find((t) => t.id === orgId);
  return team && team.role !== "member" ? team : null;
}

export async function createTeamAction(name: string): Promise<ActionResult> {
  const parsed = teamName.safeParse(name ?? "");
  if (!parsed.success) return failure("team.errors.name");
  const orgId = await createTeam(parsed.data);
  if (!orgId) return failure("team.errors.limit");
  refresh();
  redirect(`${routes.team}?ekip=${orgId}`);
}

export async function renameTeamAction(orgId: string, name: string): Promise<ActionResult> {
  const parsed = teamName.safeParse(name ?? "");
  if (!id.safeParse(orgId).success || !parsed.success) return failure("team.errors.name");
  if (!(await renameTeam(orgId, parsed.data))) return failure("team.errors.failed");
  refresh();
  return success();
}

export async function inviteMemberAction(
  orgId: string,
  rawEmail: string,
  role: string,
): Promise<ActionResult> {
  const user = await requireUser();
  const email = z
    .email()
    .max(254)
    .safeParse(
      String(rawEmail ?? "")
        .trim()
        .toLowerCase(),
    );
  if (!id.safeParse(orgId).success || !email.success) return failure("team.errors.email");
  if (role !== "admin" && role !== "member") return failure("team.errors.failed");
  const team = await adminTeam(orgId);
  if (!team) return failure("team.errors.forbidden");
  if (!(await allowRequest("FORM_LIMITER", `team-invite:${user.id}`))) {
    return failure("team.errors.rateLimited");
  }

  const result = await createTeamInvite(orgId, email.data, role);
  if (result === "exists") return failure("team.errors.inviteExists");
  if (result === "failed") return failure("team.errors.failed");

  // Email the invite. Without an account they also get a sign-up code bound
  // to this address, since registration is invite-only.
  try {
    if (serverEnv.RESEND_API_KEY) {
      const admin = createAdminClient();
      const { data: hasAccount } = await admin.rpc("email_has_account", { p_email: email.data });
      let registerUrl: string | null = null;
      if (!hasAccount) {
        const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
        const code = await insertInvitationCode({
          createdBy: user.id,
          email: email.data,
          maxUses: 1,
          expiresAt: expires,
        });
        if ("plaintext" in code) {
          registerUrl = `${APP_ORIGIN}${routes.register}?invite=${encodeURIComponent(code.plaintext)}`;
        }
      }
      const profile = await getOwnProfile();
      const mail = buildTeamInviteEmail({
        teamName: team.name,
        inviterName: profile?.full_name ?? null,
        acceptUrl: `${APP_ORIGIN}${routes.team}`,
        registerUrl,
        assetOrigin: MARKETING_ORIGIN,
      });
      await new Resend(serverEnv.RESEND_API_KEY).emails.send({
        from: CONTACT_EMAIL_FROM,
        to: email.data,
        ...(user.email ? { replyTo: user.email } : {}),
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
    }
  } catch (error) {
    console.error("Team invite email failed:", error);
  }

  refresh();
  return success();
}

export async function revokeInviteAction(inviteId: string): Promise<ActionResult> {
  if (!id.safeParse(inviteId).success) return failure("team.errors.failed");
  if (!(await revokeTeamInvite(inviteId))) return failure("team.errors.failed");
  refresh();
  return success();
}

export async function acceptInviteAction(inviteId: string): Promise<ActionResult> {
  if (!id.safeParse(inviteId).success) return failure("team.errors.failed");
  const orgId = await acceptTeamInvite(inviteId);
  if (!orgId) return failure("team.errors.inviteInvalid");
  refresh();
  redirect(`${routes.team}?ekip=${orgId}`);
}

export async function setMemberRoleAction(
  orgId: string,
  userId: string,
  role: string,
): Promise<ActionResult> {
  if (!id.safeParse(orgId).success || !id.safeParse(userId).success) {
    return failure("team.errors.failed");
  }
  if (role !== "owner" && role !== "admin" && role !== "member")
    return failure("team.errors.failed");
  if (!(await setMemberRole(orgId, userId, role))) return failure("team.errors.lastOwner");
  refresh();
  return success();
}

export async function removeMemberAction(orgId: string, userId: string): Promise<ActionResult> {
  if (!id.safeParse(orgId).success || !id.safeParse(userId).success) {
    return failure("team.errors.failed");
  }
  if (!(await removeMember(orgId, userId))) return failure("team.errors.lastOwner");
  refresh();
  return success();
}

export async function leaveTeamAction(orgId: string): Promise<ActionResult> {
  const user = await requireUser();
  if (!id.safeParse(orgId).success) return failure("team.errors.failed");
  if (!(await removeMember(orgId, user.id))) return failure("team.errors.lastOwner");
  refresh();
  redirect(routes.team);
}

export async function deleteTeamAction(orgId: string): Promise<ActionResult> {
  if (!id.safeParse(orgId).success) return failure("team.errors.failed");
  if (!(await deleteTeam(orgId))) return failure("team.errors.forbidden");
  refresh();
  redirect(routes.team);
}
