/** Follow-up pipeline for order requests (matches the order_requests.status check). */
export const ORDER_STATUSES = ["new", "contacted", "won", "lost"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type AdminOrderRequest = {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  finish: string;
  quantity: number;
  note: string | null;
  status: OrderStatus;
  source: "form" | "shopier";
  paidTotal: number | null;
};

/** wa.me link for a Turkish phone number typed in any common form. */
export function whatsappLink(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `90${digits.slice(1)}`;
  else if (digits.length === 10 && digits.startsWith("5")) digits = `90${digits}`;
  return digits.length >= 11 ? `https://wa.me/${digits}` : null;
}
