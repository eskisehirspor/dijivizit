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
  // Spam guards: a hidden field people never fill, and a minimum time on page.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", firstName: "" };
  }
  const startedAt = Number(formData.get("started_at") ?? 0);
  if (!startedAt || Date.now() - startedAt < 3000) {
    return { status: "error", message: "Lütfen formu kontrol edip tekrar gönder." };
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
