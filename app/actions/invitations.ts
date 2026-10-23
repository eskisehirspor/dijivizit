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
import { clientEnv } from "@/lib/env/client";
import { routes } from "@/lib/routes";
import {
  createInvitationSchema,
  parseInvitationExpiry,
} from "@/lib/validations/invitations";

export type CreateInvitationData = {
  plaintext: string;
};

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

  if (parsed.data.email) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const registerUrl = new URL(
      routes.register,
      clientEnv.NEXT_PUBLIC_SITE_URL,
    );

    registerUrl.searchParams.set("invite", result.plaintext);

    const { error: emailError } = await resend.emails.send({
      from: "Dijivizit <davet@dijivizit.com>",
      to: parsed.data.email,
      subject: "Dijivizit'e davet edildiniz",
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; background:#ffffff; color:#111111; max-width:600px; margin:0 auto; padding:40px 24px;">
          <div style="text-align:center;">
            <h1 style="margin:0 0 8px; font-size:32px;">Dijivizit</h1>

            <p style="font-size:18px; margin:0 0 32px;">
              Dijivizit'e katılmanız için size bir davet gönderildi.
            </p>

            <p style="font-size:14px; color:#666666; margin-bottom:10px;">
              Davet kodunuz
            </p>

            <div style="
              background:#f6f6f6;
              border:1px solid #e5e5e5;
              border-radius:10px;
              padding:18px;
              font-size:24px;
              font-weight:700;
              letter-spacing:2px;
              margin-bottom:24px;
            ">
              ${result.plaintext}
            </div>

            <a
              href="${registerUrl.toString()}"
              style="
                display:inline-block;
                background:#111111;
                color:#ffffff;
                text-decoration:none;
                padding:14px 28px;
                border-radius:8px;
                font-size:16px;
                font-weight:600;
              "
            >
              Kayıt Ol
            </a>

            <p style="font-size:13px; color:#666666; margin-top:18px;">
              Kayıt olurken davet kodunuz otomatik olarak doldurulacaktır.
            </p>

            <div style="
              border-top:1px solid #eeeeee;
              margin-top:32px;
              padding-top:24px;
              text-align:left;
            ">
              <p style="font-size:14px; font-weight:600;">
                Nasıl kullanırım?
              </p>

              <p style="font-size:14px; color:#555555; line-height:1.6;">
                <strong>1.</strong> Yukarıdaki <strong>Kayıt Ol</strong> butonuna tıklayın.
                <br />
                <strong>2.</strong> Kayıt formundaki bilgilerinizi doldurun.
                <br />
                <strong>3.</strong> Davet kodunuz kayıt sayfasında otomatik olarak doldurulacaktır.
              </p>
            </div>

            <div style="
              background:#f7f7f7;
              border-radius:8px;
              padding:16px;
              margin-top:24px;
              font-size:13px;
              color:#555555;
            ">
              Davet kodunuz yalnızca 1 kez kullanılabilir.
              ${
                expiresAt
                  ? `<br />Son kullanım tarihi: ${expiresAt}`
                  : `<br />Bu davetin son kullanım tarihi yoktur.`
              }
            </div>
          </div>
        </div>
      `,
    });

    if (emailError) {
      console.error("Invitation email failed:", emailError);
      return failure("dashboard.invites.errors.createFailed");
    }
  }

  revalidatePath(routes.invites);
  revalidatePath(routes.admin);

  return success({
    plaintext: result.plaintext,
  });
}

export async function revokeInvitationAction(
  invitationId: string,
): Promise<ActionResult> {
  await requireInviteOwner();

  const result = await revokeInvitationCode(invitationId);

  if (!result.ok) {
    return failure("dashboard.invites.errors.revokeFailed");
  }

  revalidatePath(routes.invites);
  revalidatePath(routes.admin);

  return success();
}