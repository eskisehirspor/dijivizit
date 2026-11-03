import "server-only";

import { Resend } from "resend";

import { CONTACT } from "@/lib/contact";
import { COLORS, escapeHtml, FONT } from "@/lib/email/invitation";
import { buildInvitationEmail, EMAIL_FROM, EMAIL_REPLY_TO } from "@/lib/email/invitation";
import { layout, ORDER_EMAIL_FROM, rows } from "@/lib/email/order";
import { serverEnv } from "@/lib/env/server";
import { APP_ORIGIN, MARKETING_ORIGIN } from "@/lib/hosts";
import { generateInvitationCode, hashInvitationCode } from "@/lib/invitations/code";
import { formatTry } from "@/lib/orders/finishes";
import { routes } from "@/lib/routes";
import {
  parseShopierOrder,
  summarizeItems,
  type ParsedShopierOrder,
  type ShopierOrder,
  type ShopierProductMap,
} from "@/lib/shopier/order";
import { createAdminClient } from "@/lib/supabase/admin";

/** Webhook token and product map, written by the shopier-setup workflow. */
export async function getShopierConfig(): Promise<{
  token: string | null;
  products: ShopierProductMap;
}> {
  const { data } = await createAdminClient()
    .from("integration_tokens")
    .select("name, token")
    .in("name", ["shopier_webhook_token", "shopier_products"]);
  const get = (n: string) => data?.find((r) => r.name === n)?.token ?? null;
  let products: ShopierProductMap = {};
  try {
    products = JSON.parse(get("shopier_products") ?? "{}") as ShopierProductMap;
  } catch {
    products = {};
  }
  return { token: get("shopier_webhook_token"), products };
}

const INVITE_DAYS = 30;

async function createInvite(email: string): Promise<string | null> {
  const plaintext = generateInvitationCode();
  const { error } = await createAdminClient()
    .from("invitation_codes")
    .insert({
      code_hash: hashInvitationCode(plaintext),
      email,
      max_uses: 1,
      expires_at: new Date(Date.now() + INVITE_DAYS * 86400_000).toISOString(),
      created_by: null,
    });
  return error ? null : plaintext;
}

function itemsTable(o: ParsedShopierOrder): string {
  return rows([
    ...o.items.map(
      (i) =>
        [`${i.quantity} ×`, `${escapeHtml(i.title)} · ${formatTry(i.total)}`] as [string, string],
    ),
    ["Toplam", `<strong>${formatTry(o.total)}</strong>`],
  ]);
}

function adminEmail(o: ParsedShopierOrder) {
  const subject = `Ödeme alındı: ${o.fullName} · ${summarizeItems(o.items)} · ${formatTry(o.total)}`;
  const html = layout({
    title: subject,
    preheader: escapeHtml(`Shopier #${o.orderId} · ${formatTry(o.total)}`),
    logoUrl: escapeHtml(`${MARKETING_ORIGIN}/email/logomark.png`),
    body: `<h1 style="margin:0 0 8px 0;font-family:${FONT};font-size:22px;font-weight:600;color:${COLORS.foreground};">Shopier'den ödeme alındı</h1>
      <p style="margin:0 0 24px 0;font-family:${FONT};font-size:15px;color:${COLORS.muted};">Sipariş #${escapeHtml(o.orderId)}${o.hasDigital ? " · kartsız dijital kartvizit için müşteriye kayıt bağlantısı otomatik gönderildi." : " · kartı hazırlayıp 72 saat içinde teslim et."}</p>
      ${itemsTable(o)}
      ${rows([
        ["Müşteri", escapeHtml(o.fullName)],
        ["Telefon", escapeHtml(o.phone || "—")],
        ["E-posta", escapeHtml(o.email || "—")],
        ["Adres", escapeHtml(o.address || "—")],
        ["Not", escapeHtml(o.note || "—")],
      ])}`,
  });
  const text = [
    `Shopier'den ödeme alındı — #${o.orderId}`,
    summarizeItems(o.items),
    `Toplam: ${formatTry(o.total)}`,
    `Müşteri: ${o.fullName} · ${o.phone} · ${o.email}`,
    `Adres: ${o.address}`,
    `Not: ${o.note}`,
  ].join("\n");
  return { subject, html, text };
}

function customerEmail(o: ParsedShopierOrder, registerUrl: string | null) {
  const first = o.fullName.split(" ")[0] ?? o.fullName;
  const subject = "Siparişin onaylandı";
  const cardLine = o.items.some((i) => !i.digital)
    ? "Kartını hazırlıyoruz; 72 saat içinde kargoda olur. Kart okunmazsa ücretsiz değiştiriyoruz."
    : "";
  const digitalBlock = registerUrl
    ? `<p style="margin:24px 0 8px 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${COLORS.foreground};">Dijital kartvizitini hemen kurabilirsin. Kayıt ol, profilini doldur; linkin ve QR kodun hazır.</p>
       <a href="${escapeHtml(registerUrl)}" style="display:inline-block;background:${COLORS.foreground};color:${COLORS.background};font-family:${FONT};font-size:15px;font-weight:600;text-decoration:none;padding:12px 20px;border-radius:10px;">Dijital kartvizitimi kur</a>`
    : "";
  const html = layout({
    title: subject,
    preheader: escapeHtml(`Sipariş #${o.orderId} · ${formatTry(o.total)}`),
    logoUrl: escapeHtml(`${MARKETING_ORIGIN}/email/logomark.png`),
    body: `<h1 style="margin:0 0 8px 0;font-family:${FONT};font-size:22px;font-weight:600;color:${COLORS.foreground};">Teşekkürler ${escapeHtml(first)}, ödemen alındı.</h1>
      <p style="margin:0 0 24px 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${COLORS.muted};">${escapeHtml(cardLine || "Siparişin onaylandı.")}</p>
      ${itemsTable(o)}
      ${digitalBlock}
      <p style="margin:24px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.6;color:${COLORS.muted};">Soruların için bu e-postayı yanıtla ya da <a href="${CONTACT.whatsappUrl}" style="color:${COLORS.foreground};">WhatsApp</a>'tan yaz: ${escapeHtml(CONTACT.phoneDisplay)}.</p>`,
  });
  const text = [
    `Teşekkürler ${first}, ödemen alındı.`,
    cardLine,
    summarizeItems(o.items),
    `Toplam: ${formatTry(o.total)}`,
    registerUrl ? `Dijital kartvizitini kur: ${registerUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return { subject, html, text };
}

/**
 * Records a paid Shopier order and notifies both sides. Idempotent on the
 * Shopier order id (webhooks can be retried).
 */
export async function handleShopierOrder(
  raw: ShopierOrder,
  products: ShopierProductMap,
): Promise<"stored" | "duplicate" | "invalid"> {
  const order = parseShopierOrder(raw, products);
  if (!order) return "invalid";

  const first = order.items[0];
  const { data: inserted, error } = await createAdminClient()
    .from("order_requests")
    .upsert(
      {
        source: "shopier",
        shopier_order_id: order.orderId,
        finish: first?.finish ?? first?.title.slice(0, 40) ?? "shopier",
        quantity: order.items.reduce((n, i) => n + i.quantity, 0) || 1,
        full_name: order.fullName.slice(0, 120),
        phone: order.phone.slice(0, 40),
        email: order.email || "bilinmiyor@shopier",
        note: [
          `Shopier #${order.orderId} · ${summarizeItems(order.items)}`,
          order.address && `Adres: ${order.address}`,
          order.note && `Not: ${order.note}`,
        ]
          .filter(Boolean)
          .join("\n")
          .slice(0, 1500),
        consent_at: new Date().toISOString(),
        status: "won",
        paid_total: order.total,
        paid_at: new Date().toISOString(),
      },
      { onConflict: "shopier_order_id", ignoreDuplicates: true },
    )
    .select("id");
  if (error) throw new Error(`order_requests: ${error.message}`);
  if (!inserted || inserted.length === 0) return "duplicate";

  if (!serverEnv.RESEND_API_KEY) return "stored";
  const resend = new Resend(serverEnv.RESEND_API_KEY);

  let registerUrl: string | null = null;
  if (order.hasDigital && order.email) {
    const code = await createInvite(order.email);
    if (code) {
      const url = new URL(routes.register, APP_ORIGIN);
      url.searchParams.set("invite", code);
      registerUrl = url.toString();
      const invite = buildInvitationEmail({
        code,
        registerUrl,
        expiresAt: null,
        assetOrigin: APP_ORIGIN,
      });
      await resend.emails
        .send({
          from: EMAIL_FROM,
          replyTo: EMAIL_REPLY_TO,
          to: order.email,
          subject: invite.subject,
          html: invite.html,
          text: invite.text,
        })
        .catch((e) => console.error("Shopier invite mail failed:", e));
    }
  }

  const admin = adminEmail(order);
  await resend.emails
    .send({
      from: ORDER_EMAIL_FROM,
      to: CONTACT.orderEmail,
      replyTo: order.email || CONTACT.orderEmail,
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
    })
    .catch((e) => console.error("Shopier admin mail failed:", e));

  if (order.email) {
    const mail = customerEmail(order, registerUrl);
    await resend.emails
      .send({
        from: ORDER_EMAIL_FROM,
        to: order.email,
        replyTo: CONTACT.orderEmail,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      })
      .catch((e) => console.error("Shopier customer mail failed:", e));
  }
  return "stored";
}
