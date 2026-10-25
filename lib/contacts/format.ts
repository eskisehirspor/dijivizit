/** Helpers shared by the contacts pages, the CSV export and the reminder job. */

export type ContactForExport = {
  full_name: string;
  phone: string | null;
  email: string | null;
  company: string | null;
  title: string | null;
  met_where: string | null;
  tags: string[];
  message: string | null;
  source: string;
  created_at: string;
};

/** +905406261965 -> 0540 626 19 65; anything else is shown as stored. */
export function displayPhone(phone: string | null): string {
  if (!phone) return "";
  const m = /^\+90(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(phone);
  return m ? `0${m[1]} ${m[2]} ${m[3]} ${m[4]}` : phone;
}

/** wa.me link with a prefilled message, or null without a phone number. */
export function whatsappHref(phone: string | null, text: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function followUpMessage(input: {
  contactName: string;
  ownerName: string | null;
  cardUrl: string;
}): string {
  const first = input.contactName.trim().split(/\s+/)[0] ?? input.contactName;
  const me = input.ownerName?.trim() ? `Ben ${input.ownerName.trim()}. ` : "";
  return `Merhaba ${first}, tanıştığımıza memnun oldum. ${me}Bilgilerim burada, rehberine kaydedebilirsin: ${input.cardUrl}`;
}

function csvCell(value: string): string {
  // Leading = + - @ would run as a formula in Excel; prefix with a quote.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\n\r;]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

const HEADERS = [
  "Ad soyad",
  "Telefon",
  "E-posta",
  "Şirket",
  "Unvan",
  "Nerede tanışıldı",
  "Etiketler",
  "Mesaj",
  "Kaynak",
  "Eklenme",
];

// Turkish Excel uses ";" as the list separator; Google Sheets detects either.
const SEP = ";";

/** CSV with a BOM so Excel opens Turkish characters correctly. */
export function contactsToCsv(rows: ContactForExport[]): string {
  const lines = [HEADERS.join(SEP)];
  for (const r of rows) {
    lines.push(
      [
        r.full_name,
        displayPhone(r.phone),
        r.email ?? "",
        r.company ?? "",
        r.title ?? "",
        r.met_where ?? "",
        r.tags.join(" "),
        r.message ?? "",
        r.source === "card_form" ? "Kart formu" : "Elle eklendi",
        r.created_at.slice(0, 10),
      ]
        .map(csvCell)
        .join(SEP),
    );
  }
  return `﻿${lines.join("\r\n")}\r\n`;
}

/** YYYY-MM-DD in Istanbul, the date reminders are scheduled against. */
export function istanbulToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(now);
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const DAY = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", timeZone: "UTC" });
const DAY_YEAR = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDay(isoDate: string, today = istanbulToday()): string {
  const d = new Date(`${isoDate.slice(0, 10)}T12:00:00Z`);
  return (isoDate.slice(0, 4) === today.slice(0, 4) ? DAY : DAY_YEAR).format(d);
}
