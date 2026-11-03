/**
 * Shopier order.created webhooks: signature check and the parts of the order
 * payload Dijivizit uses. Pure functions, no I/O, so they are unit-tested.
 * Docs: developer.shopier.com/reference/webhook-configuration (HMAC SHA-256,
 * hex, over the raw body, header Shopier-Signature).
 */

export type ShopierProductMap = Record<string, { id: string; url: string }>;

export type ShopierLineItem = {
  productId?: string;
  title?: string;
  type?: string;
  quantity?: number;
  price?: string;
  total?: string;
};

export type ShopierOrder = {
  id?: string | number;
  paymentStatus?: string;
  currency?: string;
  totals?: { total?: string };
  shippingInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    district?: string;
    city?: string;
  };
  note?: string;
  lineItems?: ShopierLineItem[];
};

export type ParsedShopierOrder = {
  orderId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  note: string;
  total: number;
  items: {
    finish: string | null;
    digital: boolean;
    title: string;
    quantity: number;
    total: number;
  }[];
  /** True when at least one line is the card-less digital product. */
  hasDigital: boolean;
};

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time string comparison. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function shopierSignature(rawBody: string, token: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(token),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody)));
}

export async function verifyShopierSignature(
  rawBody: string,
  signature: string | null,
  token: string,
): Promise<boolean> {
  if (!signature) return false;
  const expected = await shopierSignature(rawBody, token);
  return safeEqual(expected, signature.trim().toLowerCase());
}

function money(value: string | undefined): number {
  const n = Number(String(value ?? "0").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

export function parseShopierOrder(
  order: ShopierOrder,
  products: ShopierProductMap,
): ParsedShopierOrder | null {
  if (order.id === undefined || order.id === null || String(order.id) === "") return null;
  const byId = new Map(Object.entries(products).map(([finish, p]) => [p.id, finish]));
  const ship = order.shippingInfo ?? {};
  const items = (order.lineItems ?? []).map((li) => {
    const finish = li.productId ? (byId.get(String(li.productId)) ?? null) : null;
    return {
      finish,
      digital: finish === "digital" || li.type === "digital",
      title: li.title ?? "Ürün",
      quantity: Math.max(1, Math.floor(Number(li.quantity ?? 1)) || 1),
      total: money(li.total ?? li.price),
    };
  });
  const address = [ship.address, ship.district, ship.city].filter(Boolean).join(", ");
  return {
    orderId: String(order.id),
    fullName:
      [ship.firstName, ship.lastName].filter(Boolean).join(" ").trim() || "Shopier müşterisi",
    email: (ship.email ?? "").trim().toLowerCase(),
    phone: (ship.phone ?? "").trim(),
    address,
    note: (order.note ?? "").trim(),
    total: money(order.totals?.total),
    items,
    hasDigital: items.some((i) => i.digital),
  };
}

/** One-line summary for lists and e-mail subjects. */
export function summarizeItems(items: ParsedShopierOrder["items"]): string {
  return items.map((i) => `${i.title} × ${i.quantity}`).join(", ");
}
