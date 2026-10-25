// Daily: email each card owner the follow-ups due today (or overdue and not
// yet reminded), then stamp reminded_at so nobody gets the same reminder twice.
// Runs from .github/workflows/follow-up-reminders.yml with the service key.
import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_SECRET_KEY, RESEND_API_KEY, DRY_RUN } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) throw new Error("Supabase env missing");
if (!RESEND_API_KEY && !DRY_RUN) throw new Error("RESEND_API_KEY missing");

const APP = "https://app.dijivizit.com";
const CARD = (publicId) => `${APP}/p/${publicId}`;
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date());
const db = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const phoneText = (p) => {
  const m = /^\+90(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(p ?? "");
  return m ? `0${m[1]} ${m[2]} ${m[3]} ${m[4]}` : (p ?? "");
};
const dayText = (iso) =>
  new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  );

const { data: due, error } = await db
  .from("follow_ups")
  .select("id, due_on, note, profile_id, contact_id, contacts(full_name, phone, email, company)")
  .is("done_at", null)
  .is("reminded_at", null)
  .lte("due_on", today)
  .order("due_on")
  .limit(2000);
if (error) throw new Error(`follow_ups query failed: ${error.message}`);

const byOwner = new Map();
for (const row of due ?? []) {
  if (!byOwner.has(row.profile_id)) byOwner.set(row.profile_id, []);
  byOwner.get(row.profile_id).push(row);
}
console.log(`${due?.length ?? 0} due follow-ups for ${byOwner.size} owners (${today})`);

let sent = 0;
for (const [ownerId, items] of byOwner) {
  const [{ data: profile }, { data: auth }] = await Promise.all([
    db.from("profiles").select("full_name, public_id").eq("id", ownerId).maybeSingle(),
    db.auth.admin.getUserById(ownerId),
  ]);
  const email = auth?.user?.email;
  if (!email) continue;
  const first = profile?.full_name?.trim().split(/\s+/)[0];
  const cardUrl = profile ? CARD(profile.public_id) : APP;

  const rowsHtml = items
    .map((f) => {
      const c = f.contacts ?? {};
      const digits = (c.phone ?? "").replace(/\D/g, "");
      const name = (c.full_name ?? "").split(/\s+/)[0];
      const wa = digits
        ? `https://wa.me/${digits}?text=${encodeURIComponent(
            `Merhaba ${name}, ${profile?.full_name ? `ben ${profile.full_name}. ` : ""}Geçen görüşmemizin devamı için yazıyorum. Bilgilerim burada: ${cardUrl}`,
          )}`
        : null;
      const late =
        f.due_on < today ? ` <span style="color:#b45309;">(${esc(dayText(f.due_on))})</span>` : "";
      return `<tr><td style="padding:14px 0;border-bottom:1px solid #e5e5e5;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
        <div style="font-size:15px;font-weight:600;color:#0a0a0a;">${esc(c.full_name)}${c.company ? ` <span style="font-weight:400;color:#737373;">· ${esc(c.company)}</span>` : ""}${late}</div>
        ${f.note ? `<div style="font-size:14px;color:#404040;margin-top:4px;">${esc(f.note)}</div>` : ""}
        <div style="font-size:13px;margin-top:8px;">
          <a href="${APP}/dashboard/contacts/${f.contact_id}" style="color:#0a0a0a;">Kişiyi aç</a>
          ${wa ? ` · <a href="${esc(wa)}" style="color:#0a0a0a;">WhatsApp'tan yaz</a>` : ""}
          ${c.phone ? ` · <a href="tel:${esc(c.phone)}" style="color:#0a0a0a;">${esc(phoneText(c.phone))}</a>` : ""}
        </div></td></tr>`;
    })
    .join("");

  const subject =
    items.length === 1
      ? `Bugün takip: ${items[0].contacts?.full_name ?? "1 kişi"}`
      : `Bugün takip etmen gereken ${items.length} kişi var`;
  const html = `<!doctype html><html lang="tr"><body style="margin:0;background:#fafafa;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" style="max-width:560px;background:#fff;border:1px solid #e5e5e5;border-radius:12px;" cellpadding="0" cellspacing="0"><tr><td style="padding:32px 24px;">
<h1 style="margin:0 0 8px;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:22px;color:#0a0a0a;">${first ? `Günaydın ${esc(first)},` : "Günaydın,"}</h1>
<p style="margin:0 0 16px;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#737373;">Bugün için kurduğun takip hatırlatmaları:</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml}</table>
<p style="margin:20px 0 0;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#a3a3a3;">Bitirdiğin takipleri kişinin sayfasında "Tamamlandı" olarak işaretleyebilirsin.</p>
</td></tr></table></td></tr></table></body></html>`;
  const text = items
    .map(
      (f) =>
        `- ${f.contacts?.full_name ?? ""}${f.note ? `: ${f.note}` : ""} — ${APP}/dashboard/contacts/${f.contact_id}`,
    )
    .join("\n");

  if (DRY_RUN) {
    console.log(`[dry] would email owner ${ownerId.slice(0, 8)} about ${items.length}`);
    continue;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Dijivizit <merhaba@dijivizit.com>",
      to: email,
      subject,
      html,
      text: `Bugün takip:\n${text}`,
    }),
  });
  if (!res.ok) {
    console.error(`Resend failed for owner ${ownerId.slice(0, 8)}: ${res.status}`);
    continue;
  }
  const { error: stampError } = await db
    .from("follow_ups")
    .update({ reminded_at: new Date().toISOString() })
    .in(
      "id",
      items.map((f) => f.id),
    );
  if (stampError) console.error(`reminded_at update failed: ${stampError.message}`);
  sent += 1;
}
console.log(`sent ${sent} reminder emails`);
