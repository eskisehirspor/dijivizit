"use server";

import { Resend } from "resend";

import { cardContactSchema } from "@/lib/contacts/validation";
import { buildNewContactEmail, CONTACT_EMAIL_FROM } from "@/lib/email/contact";
import { serverEnv } from "@/lib/env/server";
import { APP_ORIGIN, MARKETING_ORIGIN } from "@/lib/hosts";
import { routes } from "@/lib/routes";
import { issueFormToken, verifyFormToken } from "@/lib/security/form-token";
import { allowRequest, clientIp } from "@/lib/security/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type CardContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; code: string; fieldErrors?: Record<string, string> };

const PURPOSE = "card-contact";

/** Called when the visitor opens the form; the card page itself stays cacheable. */
export async function getCardContactTokenAction(): Promise<string> {
  return issueFormToken(PURPOSE);
}

export async function submitCardContactAction(
  publicId: string,
  _prev: CardContactState,
  formData: FormData,
): Promise<CardContactState> {
  if (String(formData.get("website") ?? "") !== "") return { status: "success" };

  if (!(await verifyFormToken(String(formData.get("form_token") ?? ""), PURPOSE))) {
    return { status: "error", code: "card.leave.errors.expired" };
  }
  if (!(await allowRequest("FORM_LIMITER", `card-contact:${await clientIp()}`))) {
    return { status: "error", code: "card.leave.errors.rateLimited" };
  }

  const parsed = cardContactSchema.safeParse({
    fullName: formData.get("fullName") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    company: formData.get("company") ?? "",
    message: formData.get("message") ?? "",
    consent: formData.get("consent"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", code: "card.leave.errors.form", fieldErrors };
  }

  const c = parsed.data;
  const supabase = await createClient();
  const { data: saved, error } = await supabase.rpc("submit_card_contact", {
    p_public_id: String(publicId).slice(0, 64),
    p_full_name: c.fullName,
    p_phone: c.phone ?? "",
    p_email: c.email ?? "",
    p_company: c.company ?? "",
    p_message: c.message ?? "",
  });
  if (error || !saved) {
    if (error) console.error("submit_card_contact failed:", error.message);
    return { status: "error", code: "card.leave.errors.failed" };
  }

  // Tell the owner. The contact is already saved, so a mail failure is only logged.
  try {
    if (serverEnv.RESEND_API_KEY) {
      const admin = createAdminClient();
      const { data: profile } = await admin
        .from("profiles")
        .select("id, full_name")
        .eq("public_id", publicId)
        .maybeSingle();
      const owner = profile ? (await admin.auth.admin.getUserById(profile.id)).data.user : null;
      if (owner?.email) {
        const mail = buildNewContactEmail({
          ownerFirstName: profile?.full_name?.trim().split(/\s+/)[0] ?? null,
          contact: c,
          contactsUrl: `${APP_ORIGIN}${routes.contacts}`,
          assetOrigin: MARKETING_ORIGIN,
        });
        await new Resend(serverEnv.RESEND_API_KEY).emails.send({
          from: CONTACT_EMAIL_FROM,
          to: owner.email,
          ...(c.email ? { replyTo: c.email } : {}),
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
        });
      }
    }
  } catch (mailError) {
    console.error("New contact email failed:", mailError);
  }

  return { status: "success" };
}
