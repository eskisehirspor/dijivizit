// Keeps the Instagram long-lived token in Supabase (integration_tokens) so the
// weekly refresh can rotate it without a GitHub admin token.
//   node scripts/ig-token.mjs load     -> exports IG_ACCESS_TOKEN to later steps
//   node scripts/ig-token.mjs refresh  -> refreshes it and stores the new one
// The first run falls back to the IG_ACCESS_TOKEN secret. Never prints the token.
import { appendFileSync } from "node:fs";

const { SUPABASE_URL, SUPABASE_SECRET_KEY, IG_ACCESS_TOKEN: SEED, GITHUB_ENV } = process.env;
const NAME = "instagram";
const mode = process.argv[2];
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) throw new Error("Supabase env missing");

const rest = (path, init = {}) =>
  fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: SUPABASE_SECRET_KEY, "Content-Type": "application/json", ...init.headers },
  });

async function stored() {
  const res = await rest(`integration_tokens?name=eq.${NAME}&select=token,refreshed_at`);
  if (!res.ok) throw new Error(`read failed: ${res.status}`);
  const [row] = await res.json();
  return row ?? null;
}

async function save(token) {
  const res = await rest("integration_tokens?on_conflict=name", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ name: NAME, token, refreshed_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`save failed: ${res.status}`);
}

function exportToken(token) {
  console.log(`::add-mask::${token}`);
  if (GITHUB_ENV) appendFileSync(GITHUB_ENV, `IG_ACCESS_TOKEN=${token}\n`);
}

const row = await stored();
const current = row?.token || SEED;
if (!current) throw new Error("no Instagram token in Supabase or secrets");
console.log(
  `token source: ${row ? `supabase (refreshed ${row.refreshed_at.slice(0, 10)})` : "github secret"}`,
);

if (mode === "refresh") {
  const res = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(current)}`,
  );
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) {
    throw new Error(`refresh failed: ${res.status} ${body?.error?.message ?? ""}`);
  }
  await save(body.access_token);
  exportToken(body.access_token);
  console.log(`token refreshed, valid ~${Math.round((body.expires_in ?? 0) / 86400)} days`);
} else {
  if (!row) await save(current);
  exportToken(current);
}
