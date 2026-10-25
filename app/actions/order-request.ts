"use server";

import { Resend } from "resend";

import { CONTACT } from "@/lib/contact";
import {
  buildOrderConfirmationEmail,
  buildOrderNotificationEmail,
  ORDER_EMAIL_FROM,
} from "@/lib/email/order";
import { serverEnv } from "@/lib/env/server";
import { MARKETING_ORIGIN } from "@/lib/hosts";
import { orderRequestSchema } from "@/lib/orders/validation";
import { verifyFormToken } from "@/lib/security/form-token";
import { allowRequest, clientIp } from "@/lib/security/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

export type OrderFormState =
  | { status: "idle" }
  | { status: "success"; firstName: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

const RECEIVED_FORMAT = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Europe/Istanbul",
});

const FALLBACK = `Talebin şu an gönderilemedi. Lütfen ${CONTACT.phoneDisplay} numarasını ara ya da ${CONTACT.orderEmail} adresine yaz.`;

export async function submitOrderRequestAction(
  _prev: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  // Spam guards: a hidden field people never fill, a server-signed token that
  // proves the page was loaded (and not too quickly submitted), and a per-IP
  // rate limit at the edge.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", firstName: "" };
  }
  if (!(await verifyFormToken(String(formData.get("form_token") ?? ""), "order"))) {
    return {
      status: "error",
      message: "Form süresi doldu ya da çok hızlı gönderildi. Sayfayı yenileyip tekrar dene.",
    };
  }
  if (!(await allowRequest("FORM_LIMITER", `order:${await clientIp()}`))) {
    return {
      status: "error",
      message: "Çok fazla deneme yapıldı. Lütfen bir dakika sonra tekrar dene.",
    };
  }

  const parsed = orderRequestSchema.safeParse({
    finish: formData.get("finish"),
    quantity: formData.get("quantity"),
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    note: formData.get("note") ?? "",
    consent: formData.get("consent"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Birkaç alanı kontrol etmen gerekiyor.", fieldErrors };
  }

  const order = parsed.data;

  // Keep a record of every request (the email may fail) and cap repeats from
  // the same address so the form can't be used to flood someone's inbox.
  const admin = createAdminClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("order_requests")
    .select("id", { count: "exact", head: true })
    .eq("email", order.email.toLowerCase())
    .gte("created_at", since);
  if ((count ?? 0) >= 3) {
    return {
      status: "error",
      message: `Bu adresten bugün yeterince talep aldık. Acil ise ${CONTACT.phoneDisplay} numarasını ara.`,
    };
  }
  const { error: insertError } = await admin.from("order_requests").insert({
    finish: order.finish,
    quantity: order.quantity,
    full_name: order.fullName,
    phone: order.phone,
    email: order.email.toLowerCase(),
    note: order.note || null,
    consent_at: new Date().toISOString(),
  });
  if (insertError) console.error("Order request insert failed:", insertError.message);

  if (!serverEnv.RESEND_API_KEY) {
    console.error("Order request: RESEND_API_KEY is not set");
    return { status: "error", message: FALLBACK };
  }

  const resend = new Resend(serverEnv.RESEND_API_KEY);
  const notification = buildOrderNotificationEmail(order, {
    receivedAt: RECEIVED_FORMAT.format(new Date()),
    assetOrigin: MARKETING_ORIGIN,
  });

  try {
    const { error } = await resend.emails.send({
      from: ORDER_EMAIL_FROM,
      to: CONTACT.orderEmail,
      replyTo: order.email,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    });
    if (error) {
      console.error("Order notification failed:", error);
      return { status: "error", message: FALLBACK };
    }
  } catch (error) {
    console.error("Order notification failed:", error);
    return { status: "error", message: FALLBACK };
  }

  // The confirmation is a courtesy: the order already reached us, so a
  // failure here is logged and the customer still sees success.
  try {
    const confirmation = buildOrderConfirmationEmail(order, { assetOrigin: MARKETING_ORIGIN });
    const { error } = await resend.emails.send({
      from: ORDER_EMAIL_FROM,
      to: order.email,
      replyTo: CONTACT.orderEmail,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
    });
    if (error) console.error("Order confirmation failed:", error);
  } catch (error) {
    console.error("Order confirmation failed:", error);
  }

  return { status: "success", firstName: order.fullName.split(" ")[0] ?? "" };
}
