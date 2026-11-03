import { after } from "next/server";

import { getShopierConfig, handleShopierOrder } from "@/lib/shopier/handle";
import { verifyShopierSignature, type ShopierOrder } from "@/lib/shopier/order";

/**
 * Shopier webhook (order.created). Shopier expects 200 within 5 seconds, so
 * the signature is checked inline and the order is processed after the
 * response. Unsigned or wrongly signed requests get 401.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  const { token, products } = await getShopierConfig();
  if (!token) return new Response("not configured", { status: 503 });

  const ok = await verifyShopierSignature(raw, request.headers.get("shopier-signature"), token);
  if (!ok) return new Response("invalid signature", { status: 401 });

  const event = request.headers.get("shopier-event");
  if (event !== "order.created") return new Response("ignored", { status: 200 });

  let order: ShopierOrder;
  try {
    order = JSON.parse(raw) as ShopierOrder;
  } catch {
    return new Response("bad json", { status: 400 });
  }

  after(async () => {
    try {
      const result = await handleShopierOrder(order, products);
      console.log(`Shopier order ${String(order.id)}: ${result}`);
    } catch (error) {
      console.error("Shopier order handling failed:", error);
    }
  });
  return new Response("ok", { status: 200 });
}
