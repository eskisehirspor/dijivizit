// One-time (re-runnable) Shopier setup, run by .github/workflows/shopier-setup.yml.
// Lists the products in scripts/shopier-catalog.json on the Shopier shop (skips
// ones that already exist by title), subscribes to order.created webhooks and
// stores the product map and webhook token in Supabase integration_tokens.
// Secrets come from the environment and are never printed.
import fs from "node:fs";

const { SHOPIER_PAT, SUPABASE_URL, SUPABASE_SECRET_KEY, WEBHOOK_URL } = process.env;
for (const [k, v] of Object.entries({
  SHOPIER_PAT,
  SUPABASE_URL,
  SUPABASE_SECRET_KEY,
  WEBHOOK_URL,
})) {
  if (!v) {
    console.log(`::error::${k} is not set`);
    process.exit(1);
  }
}

const API = "https://api.shopier.com/v1";
const notice = (m) => console.log(`::notice::${m}`);

async function shopier(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${SHOPIER_PAT}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { status: res.status, ok: res.ok, body };
}

async function supabaseUpsert(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/integration_tokens?on_conflict=name`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SECRET_KEY,
      Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`supabase upsert ${res.status}`);
}

async function supabaseGet(name) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/integration_tokens?name=eq.${name}&select=name`,
    { headers: { apikey: SUPABASE_SECRET_KEY, Authorization: `Bearer ${SUPABASE_SECRET_KEY}` } },
  );
  return res.ok ? (await res.json()).length > 0 : false;
}

const list = (body) => (Array.isArray(body) ? body : (body?.data ?? body?.items ?? []));

// 1. Products
const catalog = JSON.parse(fs.readFileSync("scripts/shopier-catalog.json", "utf8"));
let existing = await shopier("/products");
if (existing.status === 403) {
  notice("GET /products 403, trying page/limit params");
  existing = await shopier("/products?page=1&limit=10");
}
if (!existing.ok) {
  notice(`GET /products -> ${existing.status} ${JSON.stringify(existing.body).slice(0, 400)}`);
  // Diagnostics without revealing the token.
  notice(`token length ${SHOPIER_PAT.length}, trimmed ${SHOPIER_PAT.trim().length}, dots ${SHOPIER_PAT.split(".").length - 1}, starts-with-bearer ${/^bearer\s/i.test(SHOPIER_PAT)}`);
  for (const path of ["/orders?limit=1", "/webhooks", "/shop/settings", "/categories"]) {
    const r = await shopier(path);
    notice(`GET ${path} -> ${r.status} ${JSON.stringify(r.body).slice(0, 160)}`);
  }
  process.exit(1);
}
const byTitle = new Map(list(existing.body).map((p) => [p.title, p]));
const map = {};
for (const item of catalog) {
  let product = byTitle.get(item.title);
  if (!product) {
    const payload = {
      title: item.title,
      description: item.description,
      type: item.type,
      media: [{ type: "image", url: item.image, placement: 1 }],
      priceData: { currency: "TRY", price: item.price, shippingPrice: "0.00" },
      stockQuantity: 500,
      shippingPayer: "sellerPays",
      placementScore: item.placementScore,
      ...(item.type === "physical" ? { dispatchDuration: 1 } : {}),
    };
    const created = await shopier("/products", { method: "POST", body: JSON.stringify(payload) });
    if (!created.ok) {
      notice(
        `POST /products ${item.finish} -> ${created.status} ${JSON.stringify(created.body).slice(0, 600)}`,
      );
      process.exit(1);
    }
    product = created.body;
    notice(`created ${item.finish}: ${product.id} ${product.url}`);
  } else {
    notice(`exists ${item.finish}: ${product.id} ${product.url}`);
  }
  map[item.finish] = { id: String(product.id), url: product.url };
}
await supabaseUpsert([{ name: "shopier_products", token: JSON.stringify(map) }]);
notice(`PRODUCTS ${JSON.stringify(map)}`);

// 2. Webhook for paid orders
const hooks = await shopier("/webhooks");
if (!hooks.ok) {
  notice(`GET /webhooks -> ${hooks.status} ${JSON.stringify(hooks.body).slice(0, 400)}`);
  process.exit(1);
}
const mine = list(hooks.body).filter((h) => h.event === "order.created" && h.url === WEBHOOK_URL);
const haveToken = await supabaseGet("shopier_webhook_token");
if (mine.length && haveToken) {
  notice(`webhook already set: ${mine.map((h) => h.id).join(",")}`);
} else {
  // The token is only returned on creation, so recreate if we do not have it.
  for (const h of mine) await shopier(`/webhooks/${h.id}`, { method: "DELETE" });
  const created = await shopier("/webhooks", {
    method: "POST",
    body: JSON.stringify({ event: "order.created", url: WEBHOOK_URL }),
  });
  if (!created.ok || !created.body?.token) {
    notice(
      `POST /webhooks -> ${created.status} ${JSON.stringify({ ...created.body, token: created.body?.token ? "***" : undefined }).slice(0, 400)}`,
    );
    process.exit(1);
  }
  await supabaseUpsert([{ name: "shopier_webhook_token", token: created.body.token }]);
  notice(`webhook created: ${created.body.id} -> ${WEBHOOK_URL} (token stored)`);
}
