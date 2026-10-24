/**
 * Invitation email, styled after the app: white, near-black type, hairline
 * borders, one filled button. Email clients ignore <style> blocks and SVG, so
 * everything is inline and table-based and the mark is a hosted PNG.
 */

export const EMAIL_FROM = "Dijivizit <merhaba@dijivizit.com>";
export const EMAIL_REPLY_TO = "merhaba@dijivizit.com";

export const COLORS = {
  background: "#ffffff",
  canvas: "#f5f5f5",
  foreground: "#0a0a0a",
  primary: "#171717",
  muted: "#737373",
  border: "#e5e5e5",
  subtle: "#fafafa",
} as const;

export const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;
const MONO = `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type InvitationEmailInput = {
  code: string;
  registerUrl: string;
  /** Pre-formatted, e.g. "1 Kasım 2026 23:59". Null means no expiry. */
  expiresAt: string | null;
  /** Absolute origin used for the hosted logo. */
  assetOrigin: string;
};

export function buildInvitationEmail(input: InvitationEmailInput): {
  subject: string;
  html: string;
  text: string;
} {
  const code = escapeHtml(input.code);
  const url = escapeHtml(input.registerUrl);
  const logo = escapeHtml(`${input.assetOrigin.replace(/\/+$/, "")}/email/logomark.png`);
  const expiry = input.expiresAt
    ? `Son kullanım: ${escapeHtml(input.expiresAt)}`
    : "Son kullanım tarihi yok";

  const subject = "Dijivizit'e davetlisin";

  const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.canvas};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Davet kodun: ${code} — kartını birkaç dakikada oluştur.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.canvas};">
<tr><td align="center" style="padding:40px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
    <tr><td style="padding:0 4px 24px 4px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="vertical-align:middle;"><img src="${logo}" width="36" height="36" alt="" style="display:block;border:0;"></td>
        <td style="vertical-align:middle;padding-left:10px;font-family:${FONT};font-size:20px;font-weight:600;letter-spacing:-0.03em;color:${COLORS.foreground};">Dijivizit</td>
      </tr></table>
    </td></tr>

    <tr><td style="background:${COLORS.background};border:1px solid ${COLORS.border};border-radius:12px;padding:32px 24px;">
      <h1 style="margin:0 0 8px 0;font-family:${FONT};font-size:22px;line-height:1.3;font-weight:600;letter-spacing:-0.02em;color:${COLORS.foreground};">Dijivizit'e davetlisin</h1>
      <p style="margin:0 0 28px 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${COLORS.muted};">Dijital kartvizitini oluştur, NFC kartın veya QR kodunla tek dokunuşta paylaş. Kayıt olurken aşağıdaki kodu kullan.</p>

      <p style="margin:0 0 8px 0;font-family:${FONT};font-size:12px;font-weight:500;color:${COLORS.muted};">Davet kodun</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;">
        <tr><td align="center" style="background:${COLORS.subtle};border:1px solid ${COLORS.border};border-radius:8px;padding:16px 8px;font-family:${MONO};font-size:18px;font-weight:600;letter-spacing:0.04em;white-space:nowrap;color:${COLORS.foreground};">${code}</td></tr>
      </table>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0;">
        <tr><td style="border-radius:8px;background:${COLORS.primary};">
          <a href="${url}" style="display:inline-block;padding:12px 24px;font-family:${FONT};font-size:15px;font-weight:500;color:#ffffff;text-decoration:none;border-radius:8px;">Hesabını oluştur</a>
        </td></tr>
      </table>
      <p style="margin:0;font-family:${FONT};font-size:13px;line-height:1.6;color:${COLORS.muted};">Butona tıkladığında kod kayıt formuna otomatik girilir. Kod yalnızca bir kez kullanılabilir. ${expiry}.</p>
    </td></tr>

    <tr><td style="padding:24px 4px 0 4px;font-family:${FONT};font-size:12px;line-height:1.6;color:${COLORS.muted};">
      Bu e-postayı Dijivizit ekibi seni davet ettiği için aldın. Sorun olursa bu e-postayı yanıtlaman yeterli.<br>
      <a href="https://dijivizit.com" style="color:${COLORS.muted};text-decoration:underline;">dijivizit.com</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    "Dijivizit'e davetlisin",
    "",
    "Dijital kartvizitini oluştur, NFC kartın veya QR kodunla tek dokunuşta paylaş.",
    "",
    `Davet kodun: ${input.code}`,
    `Hesabını oluştur: ${input.registerUrl}`,
    "",
    `Kod yalnızca bir kez kullanılabilir. ${input.expiresAt ? `Son kullanım: ${input.expiresAt}` : "Son kullanım tarihi yok"}.`,
    "",
    "Sorun olursa bu e-postayı yanıtlaman yeterli.",
    "dijivizit.com",
  ].join("\n");

  return { subject, html, text };
}
