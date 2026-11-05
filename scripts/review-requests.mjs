// Daily: a few days after a paid Shopier order, ask the customer for a Google
// review (once). Runs from .github/workflows/follow-up-reminders.yml.
import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_SECRET_KEY, RESEND_API_KEY, DRY_RUN } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) throw new Error("Supabase env missing");
if (!RESEND_API_KEY && !DRY_RUN) throw new Error("RESEND_API_KEY missing");

const REVIEW_URL = "https://g.page/r/CcJxbgUqllgKEBM/review";
const DAYS_AFTER = 5; // cards arrive within 72 hours; give people a couple of days with it
const db = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

const before = new Date(Date.now() - DAYS_AFTER * 86400_000).toISOString();
const notBefore = new Date(Date.now() - 30 * 86400_000).toISOString();
const { data: orders, error } = await db
  .from("order_requests")
  .select("id, full_name, email, created_at")
  .eq("source", "shopier")
  .eq("status", "won")
  .is("review_requested_at", null)
  .lte("created_at", before)
  .gte("created_at", notBefore)
  .limit(200);
if (error) throw new Error(`order_requests query failed: ${error.message}`);
console.log(`${orders?.length ?? 0} review requests due`);

for (const o of orders ?? []) {
  if (!o.email || !o.email.includes("@") || o.email.endsWith("@shopier")) continue;
  const first = (o.full_name ?? "").trim().split(/\s+/)[0];
  const font = "-apple-system,Segoe UI,Roboto,Arial,sans-serif";
  const html = `<!doctype html><html lang="tr"><body style="margin:0;background:#fafafa;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" style="max-width:560px;background:#fff;border:1px solid #e5e5e5;border-radius:12px;" cellpadding="0" cellspacing="0"><tr><td style="padding:32px 24px;">
<h1 style="margin:0 0 8px;font-family:${font};font-size:22px;color:#0a0a0a;">${first ? `Merhaba ${esc(first)},` : "Merhaba,"}</h1>
<p style="margin:0 0 16px;font-family:${font};font-size:15px;line-height:1.6;color:#404040;">Dijivizit'in eline ulaştığını umuyoruz. Deneyimini Google'da birkaç cümleyle paylaşırsan, küçük bir ekip olarak bizim için çok değerli olur. Bir dakikanı alır.</p>
<a href="${REVIEW_URL}" style="display:inline-block;background:#0a0a0a;color:#fff;font-family:${font};font-size:15px;font-weight:600;text-decoration:none;padding:12px 20px;border-radius:10px;">Google'da yorum bırak</a>
<p style="margin:24px 0 0;font-family:${font};font-size:13px;line-height:1.6;color:#737373;">Bir sorun varsa yorum yerine bu e-postayı yanıtla; hemen çözelim. Kart okunmazsa ücretsiz yenisini gönderiyoruz.</p>
</td></tr></table></td></tr></table></body></html>`;
  const text = `${first ? `Merhaba ${first},` : "Merhaba,"}\n\nDijivizit'in eline ulaştığını umuyoruz. Deneyimini Google'da paylaşırsan çok seviniriz: ${REVIEW_URL}\n\nBir sorun varsa bu e-postayı yanıtla; hemen çözelim.`;
  if (DRY_RUN) {
    console.log(`[dry] would ask ${o.id.slice(0, 8)} for a review`);
    continue;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Dijivizit <merhaba@dijivizit.com>",
      reply_to: "talep@dijivizit.com",
      to: o.email,
      subject: "Dijivizit'in nasıl? Bir dakikanı alır",
      html,
      text,
    }),
  });
  if (!res.ok) {
    console.error(`Resend failed for ${o.id.slice(0, 8)}: ${res.status}`);
    continue;
  }
  await db
    .from("order_requests")
    .update({ review_requested_at: new Date().toISOString() })
    .eq("id", o.id);
}
