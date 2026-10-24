import { CONTACT } from "@/lib/contact";
import { COLORS, escapeHtml, FONT } from "@/lib/email/invitation";
import { finishLabel } from "@/lib/orders/finishes";
import type { OrderRequest } from "@/lib/orders/validation";

export const ORDER_EMAIL_FROM = "Dijivizit Sipariş <merhaba@dijivizit.com>";

function formatPhone(e164: string): string {
  // +905406261965 -> 0540 626 19 65
  const d = e164.replace(/^\+90/, "");
  return `0${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8)}`;
}

function layout(input: { title: string; preheader: string; body: string; logoUrl: string }) {
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${input.title}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.canvas};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${input.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.canvas};">
<tr><td align="center" style="padding:40px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
    <tr><td style="padding:0 4px 24px 4px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="vertical-align:middle;"><img src="${input.logoUrl}" width="36" height="36" alt="" style="display:block;border:0;"></td>
        <td style="vertical-align:middle;padding-left:10px;font-family:${FONT};font-size:20px;font-weight:600;letter-spacing:-0.03em;color:${COLORS.foreground};">Dijivizit</td>
      </tr></table>
    </td></tr>
    <tr><td style="background:${COLORS.background};border:1px solid ${COLORS.border};border-radius:12px;padding:32px 24px;">
      ${input.body}
    </td></tr>
    <tr><td style="padding:24px 4px 0 4px;font-family:${FONT};font-size:12px;line-height:1.6;color:${COLORS.muted};">
      Dijivizit · ${escapeHtml(CONTACT.addressLines.join(", "))} · ${escapeHtml(CONTACT.phoneDisplay)}<br>
      <a href="https://dijivizit.com" style="color:${COLORS.muted};text-decoration:underline;">dijivizit.com</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

function rows(pairs: [string, string][]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${COLORS.border};">
${pairs
  .map(
    ([k, v]) => `<tr>
  <td style="padding:12px 12px 12px 0;border-bottom:1px solid ${COLORS.border};font-family:${FONT};font-size:13px;color:${COLORS.muted};white-space:nowrap;vertical-align:top;width:120px;">${escapeHtml(k)}</td>
  <td style="padding:12px 0;border-bottom:1px solid ${COLORS.border};font-family:${FONT};font-size:15px;line-height:1.5;color:${COLORS.foreground};vertical-align:top;">${v}</td>
</tr>`,
  )
  .join("\n")}
</table>`;
}

type Built = { subject: string; html: string; text: string };

/** The notification that lands in talep@dijivizit.com. Reply goes to the customer. */
export function buildOrderNotificationEmail(
  order: OrderRequest,
  meta: { receivedAt: string; assetOrigin: string },
): Built {
  const finish = finishLabel(order.finish);
  const phone = formatPhone(order.phone);
  const subject = `Yeni sipariş talebi: ${order.fullName} · ${finish} × ${order.quantity}`;
  const note = order.note ? escapeHtml(order.note).replace(/\n/g, "<br>") : "—";
  const html = layout({
    title: escapeHtml(subject),
    preheader: escapeHtml(`${order.fullName} · ${finish} × ${order.quantity} · ${phone}`),
    logoUrl: escapeHtml(`${meta.assetOrigin}/email/logomark.png`),
    body: `<h1 style="margin:0 0 6px 0;font-family:${FONT};font-size:22px;font-weight:600;letter-spacing:-0.02em;color:${COLORS.foreground};">Yeni sipariş talebi</h1>
      <p style="margin:0 0 24px 0;font-family:${FONT};font-size:14px;color:${COLORS.muted};">${escapeHtml(meta.receivedAt)} · dijivizit.com/siparis</p>
      ${rows([
        ["Ad soyad", escapeHtml(order.fullName)],
        [
          "Telefon",
          `<a href="tel:${escapeHtml(order.phone)}" style="color:${COLORS.foreground};">${escapeHtml(phone)}</a>`,
        ],
        [
          "E-posta",
          `<a href="mailto:${escapeHtml(order.email)}" style="color:${COLORS.foreground};">${escapeHtml(order.email)}</a>`,
        ],
        ["Kaplama", escapeHtml(finish)],
        ["Adet", String(order.quantity)],
        ["Not", note],
      ])}
      <p style="margin:24px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.6;color:${COLORS.muted};">Bu e-postayı yanıtladığında yanıtın doğrudan müşteriye gider.</p>`,
  });
  const text = [
    "Yeni sipariş talebi",
    meta.receivedAt,
    "",
    `Ad soyad: ${order.fullName}`,
    `Telefon: ${phone}`,
    `E-posta: ${order.email}`,
    `Kaplama: ${finish}`,
    `Adet: ${order.quantity}`,
    `Not: ${order.note || "—"}`,
  ].join("\n");
  return { subject, html, text };
}

/** Confirmation sent to the customer. Reply goes to talep@. */
export function buildOrderConfirmationEmail(
  order: OrderRequest,
  meta: { assetOrigin: string },
): Built {
  const finish = finishLabel(order.finish);
  const firstName = order.fullName.split(" ")[0] ?? order.fullName;
  const subject = "Sipariş talebini aldık";
  const html = layout({
    title: subject,
    preheader: escapeHtml(`${finish} × ${order.quantity} — en kısa sürede dönüş yapacağız.`),
    logoUrl: escapeHtml(`${meta.assetOrigin}/email/logomark.png`),
    body: `<h1 style="margin:0 0 8px 0;font-family:${FONT};font-size:22px;font-weight:600;letter-spacing:-0.02em;color:${COLORS.foreground};">Teşekkürler ${escapeHtml(firstName)}, talebini aldık.</h1>
      <p style="margin:0 0 24px 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${COLORS.muted};">Ekibimiz en kısa sürede seninle iletişime geçip tasarım ve teslimat detaylarını netleştirecek.</p>
      ${rows([
        ["Kaplama", escapeHtml(finish)],
        ["Adet", String(order.quantity)],
        ["Telefon", escapeHtml(formatPhone(order.phone))],
      ])}
      <p style="margin:24px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.6;color:${COLORS.muted};">Bir şey eklemek istersen bu e-postayı yanıtla ya da <a href="${CONTACT.whatsappUrl}" style="color:${COLORS.foreground};">WhatsApp</a>'tan yaz: ${escapeHtml(CONTACT.phoneDisplay)}.</p>`,
  });
  const text = [
    `Teşekkürler ${firstName}, talebini aldık.`,
    "",
    "Ekibimiz en kısa sürede seninle iletişime geçecek.",
    "",
    `Kaplama: ${finish}`,
    `Adet: ${order.quantity}`,
    "",
    `Bir şey eklemek istersen bu e-postayı yanıtla ya da ${CONTACT.phoneDisplay} numarasına yaz.`,
  ].join("\n");
  return { subject, html, text };
}
