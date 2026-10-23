"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import {
  insertInvitationCode,
  requireInviteOwner,
  revokeInvitationCode,
} from "@/lib/dal/invitations";
import { buildInvitationEmail, EMAIL_FROM, EMAIL_REPLY_TO } from "@/lib/email/invitation";
import { serverEnv } from "@/lib/env/server";
import { APP_ORIGIN } from "@/lib/hosts";
import { routes } from "@/lib/routes";
import { createInvitationSchema, parseInvitationExpiry } from "@/lib/validations/invitations";

export type CreateInvitationData = {
  plaintext: string;
  /** null when no email was given; false when sending failed or is not configured. */
  emailSent: boolean | null;
};

const EXPIRY_FORMAT = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Europe/Istanbul",
});

function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === "string" && !(field in result)) {
      result[field] = issue.message;
    }
  }

  return result;
}

export async function createInvitationAction(
  _previous: ActionResult<CreateInvitationData> | null,
  formData: FormData,
): Promise<ActionResult<CreateInvitationData>> {
  const owner = await requireInviteOwner();

  const parsed = createInvitationSchema.safeParse({
    email: formData.get("email") ?? "",
    maxUses: "1",
    expiresAt: formData.get("expiresAt") ?? "",
  });

  if (!parsed.success) {
    return failure("auth.errors.unknown", fieldErrorsOf(parsed.error));
  }

  const expiresAt = parseInvitationExpiry(parsed.data.expiresAt);

  if (expiresAt !== null && typeof expiresAt === "object") {
    return failure("dashboard.invites.errors.expiresAt", {
      expiresAt: "dashboard.invites.errors.expiresAt",
    });
  }

  const result = await insertInvitationCode({
    createdBy: owner.id,
    email: parsed.data.email === "" ? null : parsed.data.email,
    maxUses: 1,
    expiresAt,
  });

  if ("error" in result) {
    return failure("dashboard.invites.errors.createFailed");
  }

  // The code already exists at this point, so a mail problem must not turn
  // into a failure: the owner would never see the (valid) plaintext again.
  let emailSent: boolean | null = null;

  if (parsed.data.email) {
    emailSent = await sendInvitationEmail({
      to: parsed.data.email,
      plaintext: result.plaintext,
      expiresAt,
    });
  }

  revalidatePath(routes.invites);
  revalidatePath(routes.admin);

  return success({
    plaintext: result.plaintext,
    emailSent,
  });
}

async function sendInvitationEmail(input: {
  to: string;
  plaintext: string;
  expiresAt: string | null;
}): Promise<boolean> {
  if (!serverEnv.RESEND_API_KEY) {
    return false;
  }

  // Always the production app, whichever deployment sends the mail: invitees
  // must land on the real site, never on a staging or preview URL.
  const registerUrl = new URL(routes.register, APP_ORIGIN);
  registerUrl.searchParams.set("invite", input.plaintext);

  const email = buildInvitationEmail({
    code: input.plaintext,
    registerUrl: registerUrl.toString(),
    expiresAt: input.expiresAt ? EXPIRY_FORMAT.format(new Date(input.expiresAt)) : null,
    assetOrigin: APP_ORIGIN,
  });

  try {
    const resend = new Resend(serverEnv.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      replyTo: EMAIL_REPLY_TO,
      to: input.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });

    if (error) {
      console.error("Invitation email failed:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Invitation email failed:", error);
    return false;
  }
}

export async function revokeInvitationAction(invitationId: string): Promise<ActionResult> {
  await requireInviteOwner();

  const result = await revokeInvitationCode(invitationId);

  if (!result.ok) {
    return failure("dashboard.invites.errors.revokeFailed");
  }

  revalidatePath(routes.invites);
  revalidatePath(routes.admin);

  return success();
}
