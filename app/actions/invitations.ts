"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { insertInvitationCode, requireInviteOwner } from "@/lib/dal/invitations";
import { routes } from "@/lib/routes";
import { createInvitationSchema, parseInvitationExpiry } from "@/lib/validations/invitations";

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
    maxUses: formData.get("maxUses") ?? "1",
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
    maxUses: parsed.data.maxUses,
    expiresAt,
  });

  if ("error" in result) {
    return failure("dashboard.invites.errors.createFailed");
  }
  
  if (parsed.data.email) {
    const resend = new Resend(process.env.RESEND_API_KEY);
  
    const { error: emailError } = await resend.emails.send({
      from: "Dijivizit <davet@dijivizit.com>",
      to: parsed.data.email,
      subject: "Dijivizit davet kodunuz",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Dijivizit</h1>
          <p>Dijivizit'e katılmanız için size bir davet gönderildi.</p>
  
          <p>Davet kodunuz:</p>
  
          <div style="
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 16px;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
            text-align: center;
            margin: 20px 0;
          ">
            ${result.plaintext}
          </div>
  
          <p>
            Bu kod ile Dijivizit'e kayıt olabilirsiniz.
          </p>
  
          ${
            expiresAt
              ? `<p style="color: #666; font-size: 14px;">
                  Davet kodunun son kullanım tarihi: ${expiresAt}
                </p>`
              : ""
          }
  
          <p style="color: #666; font-size: 14px;">
            Bu davet kodu ${parsed.data.maxUses} kez kullanılabilir.
          </p>
        </div>
      `,
    });
  
    if (emailError) {
      console.error("Invitation email failed:", emailError);
      return failure("dashboard.invites.errors.createFailed");
    }
  }
  
  revalidatePath(routes.invites);
  return success({ plaintext: result.plaintext });
}
