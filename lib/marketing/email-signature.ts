/**
 * HTML e-mail signature for the free tool at /e-posta-imzasi-olustur. Table
 * layout with inline styles only, so it survives Gmail, Outlook and Apple Mail.
 */

export type SignatureFields = {
  fullName: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  profileUrl: string;
};

export const SIGNATURE_ACCENTS = [
  { id: "ink", label: "Siyah", hex: "#121213" },
  { id: "navy", label: "Lacivert", hex: "#1f3a68" },
  { id: "green", label: "Yeşil", hex: "#1d5c45" },
  { id: "bordo", label: "Bordo", hex: "#7a1f2b" },
] as const;

export type SignatureOptions = {
  accent: string;
  /** Adds the "Dijital kartvizit bağlantım" line. */
  cardLine: boolean;
};

const DIJIVIZIT_URL = "https://dijivizit.com";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** https:// URL from what the visitor typed, or "" if it is not a web address. */
export function webUrl(raw: string): string {
  const u = raw.trim();
  if (!u) return "";
  const withScheme = /^https?:\/\//i.test(u) ? u : `https://${u}`;
  try {
    const parsed = new URL(withScheme);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "";
    if (!parsed.hostname.includes(".")) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

/** "dijivizit.com/p/abc" from a full URL, for link text. */
export function displayUrl(url: string): string {
  return url
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

const FONT = "Arial,Helvetica,sans-serif";

/** The signature as a self-contained HTML fragment. */
export function buildSignatureHtml(f: SignatureFields, o: SignatureOptions): string {
  const accent = /^#[0-9a-f]{6}$/i.test(o.accent) ? o.accent : SIGNATURE_ACCENTS[0].hex;
  const name = f.fullName.trim() || "Ad Soyad";
  const role = [f.title.trim(), f.company.trim()].filter(Boolean).join(", ");
  const website = webUrl(f.website);
  const profile = webUrl(f.profileUrl);
  const email = f.email.trim();
  const phone = f.phone.trim();

  const link = (href: string, text: string) =>
    `<a href="${esc(href)}" style="color:#3d3c39;text-decoration:none;">${esc(text)}</a>`;

  const contact: string[] = [];
  if (phone) contact.push(link(telHref(phone), phone));
  if (email) contact.push(link(`mailto:${email}`, email));
  if (website) contact.push(link(website, displayUrl(website)));

  const rows: string[] = [
    `<tr><td style="padding:0 0 2px 0;font-family:${FONT};font-size:16px;line-height:22px;font-weight:bold;color:#121213;">${esc(name)}</td></tr>`,
  ];
  if (role) {
    rows.push(
      `<tr><td style="padding:0 0 8px 0;font-family:${FONT};font-size:13px;line-height:18px;color:#5e5d59;">${esc(role)}</td></tr>`,
    );
  }
  if (contact.length) {
    rows.push(
      `<tr><td style="padding:0;font-family:${FONT};font-size:13px;line-height:20px;color:#3d3c39;">${contact.join(`<span style="color:#b5b3ad;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>`)}</td></tr>`,
    );
  }
  if (o.cardLine) {
    const href = profile || DIJIVIZIT_URL;
    const text = profile ? "Dijital kartvizit bağlantım" : "Dijital kartvizit: dijivizit.com";
    rows.push(
      `<tr><td style="padding:8px 0 0 0;font-family:${FONT};font-size:12px;line-height:18px;"><a href="${esc(href)}" style="color:${accent};font-weight:bold;text-decoration:none;">${esc(text)} &#8250;</a></td></tr>`,
    );
  }

  return [
    `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;font-family:${FONT};">`,
    `<tr>`,
    `<td style="width:4px;background-color:${accent};font-size:1px;line-height:1px;" width="4" bgcolor="${accent}">&nbsp;</td>`,
    `<td style="padding:2px 0 2px 14px;vertical-align:top;">`,
    `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">`,
    rows.join(""),
    `</table>`,
    `</td>`,
    `</tr>`,
    `</table>`,
  ].join("");
}

/** Plain-text version for the clipboard's text/plain part. */
export function buildSignatureText(f: SignatureFields, o: SignatureOptions): string {
  const website = webUrl(f.website);
  const profile = webUrl(f.profileUrl);
  return [
    f.fullName.trim() || "Ad Soyad",
    [f.title.trim(), f.company.trim()].filter(Boolean).join(", "),
    [f.phone.trim(), f.email.trim(), website && displayUrl(website)].filter(Boolean).join(" | "),
    o.cardLine
      ? profile
        ? `Dijital kartvizit bağlantım: ${profile}`
        : `Dijital kartvizit: ${DIJIVIZIT_URL}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}
