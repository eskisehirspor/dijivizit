import { displayPhone } from "@/lib/contacts/format";
import { COLORS, escapeHtml, FONT } from "@/lib/email/invitation";
import { layout, rows } from "@/lib/email/order";

export const CONTACT_EMAIL_FROM = "Dijivizit <merhaba@dijivizit.com>";

type Built = { subject: string; html: string; text: string };

function button(href: string, label: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:${COLORS.foreground};color:${COLORS.background};font-family:${FONT};font-size:15px;font-weight:600;text-decoration:none;padding:12px 20px;border-radius:10px;">${escapeHtml(label)}</a>`;
}

/** Sent to a card owner when a visitor leaves their details on the card. */
export function buildNewContactEmail(input: {
  ownerFirstName: string | null;
  contact: {
    fullName: string;
    phone: string | null;
    email: string | null;
    company: string | null;
    message: string | null;
  };
  contactsUrl: string;
  assetOrigin: string;
}): Built {
  const c = input.contact;
  const subject = `Kartından yeni kişi: ${c.fullName}`;
  const pairs: [string, string][] = [["Ad soyad", escapeHtml(c.fullName)]];
  if (c.phone) {
    pairs.push([
      "Telefon",
      `<a href="tel:${escapeHtml(c.phone)}" style="color:${COLORS.foreground};">${escapeHtml(displayPhone(c.phone))}</a>`,
    ]);
  }
  if (c.email) {
    pairs.push([
      "E-posta",
      `<a href="mailto:${escapeHtml(c.email)}" style="color:${COLORS.foreground};">${escapeHtml(c.email)}</a>`,
    ]);
  }
  if (c.company) pairs.push(["Şirket", escapeHtml(c.company)]);
  if (c.message) pairs.push(["Mesaj", escapeHtml(c.message).replace(/\n/g, "<br>")]);

  const hello = input.ownerFirstName ? `Merhaba ${escapeHtml(input.ownerFirstName)},` : "Merhaba,";
  const html = layout({
    title: escapeHtml(subject),
    preheader: escapeHtml(`${c.fullName} kartından bilgilerini bıraktı.`),
    logoUrl: escapeHtml(`${input.assetOrigin}/email/logomark.png`),
    body: `<h1 style="margin:0 0 6px 0;font-family:${FONT};font-size:22px;font-weight:600;letter-spacing:-0.02em;color:${COLORS.foreground};">${escapeHtml(c.fullName)} bilgilerini bıraktı</h1>
      <p style="margin:0 0 24px 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${COLORS.muted};">${hello} dijital kartını görüntüleyen biri iletişim bilgilerini sana bıraktı. Kişi listene eklendi.</p>
      ${rows(pairs)}
      <p style="margin:28px 0 0 0;">${button(input.contactsUrl, "Kişilerimde aç")}</p>
      <p style="margin:20px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.6;color:${COLORS.muted};">İpucu: kişinin sayfasından bir takip hatırlatması kur, zamanı gelince sana e-posta atalım.</p>`,
  });
  const text = [
    `${c.fullName} bilgilerini bıraktı`,
    "",
    `Telefon: ${c.phone ? displayPhone(c.phone) : "—"}`,
    `E-posta: ${c.email ?? "—"}`,
    `Şirket: ${c.company ?? "—"}`,
    `Mesaj: ${c.message ?? "—"}`,
    "",
    `Kişilerin: ${input.contactsUrl}`,
  ].join("\n");
  return { subject, html, text };
}
