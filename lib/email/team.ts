import { COLORS, escapeHtml, FONT } from "@/lib/email/invitation";
import { layout } from "@/lib/email/order";

type Built = { subject: string; html: string; text: string };

export function buildTeamInviteEmail(input: {
  teamName: string;
  inviterName: string | null;
  acceptUrl: string;
  registerUrl: string | null;
  assetOrigin: string;
}): Built {
  const who = input.inviterName ? `${input.inviterName}, ` : "";
  const subject = `${input.teamName} ekibine davet edildin`;
  const primaryUrl = input.registerUrl ?? input.acceptUrl;
  const primaryLabel = input.registerUrl ? "Hesabını oluştur ve katıl" : "Daveti görüntüle";
  const html = layout({
    title: escapeHtml(subject),
    preheader: escapeHtml(`${who}seni Dijivizit'te ${input.teamName} ekibine ekledi.`),
    logoUrl: escapeHtml(`${input.assetOrigin}/email/logomark.png`),
    body: `<h1 style="margin:0 0 8px 0;font-family:${FONT};font-size:22px;font-weight:600;letter-spacing:-0.02em;color:${COLORS.foreground};">${escapeHtml(input.teamName)} ekibine davet edildin</h1>
      <p style="margin:0 0 24px 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${COLORS.muted};">${escapeHtml(who)}seni Dijivizit'te ekibine ekledi. Katıldığında şirketin sana dijital kartvizit atayabilir; kartından bilgi bırakan kişiler hem sana hem ekip yöneticine ulaşır.</p>
      <p style="margin:0;"><a href="${escapeHtml(primaryUrl)}" style="display:inline-block;background:${COLORS.foreground};color:${COLORS.background};font-family:${FONT};font-size:15px;font-weight:600;text-decoration:none;padding:12px 20px;border-radius:10px;">${primaryLabel}</a></p>
      ${
        input.registerUrl
          ? `<p style="margin:20px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.6;color:${COLORS.muted};">Kayıt olurken bu e-posta adresini kullan. Kaydın bitince Ekip sayfasında daveti kabul edebilirsin.</p>`
          : `<p style="margin:20px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.6;color:${COLORS.muted};">Giriş yaptıktan sonra Ekip sayfasında "Katıl"a bas.</p>`
      }`,
  });
  const text = [
    subject,
    "",
    `${who}seni Dijivizit'te ekibine ekledi.`,
    `${primaryLabel}: ${primaryUrl}`,
  ].join("\n");
  return { subject, html, text };
}
