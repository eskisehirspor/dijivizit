/**
 * Hands what a visitor typed into a free tool over to the order form, through
 * sessionStorage so personal details never end up in a URL.
 */
const KEY = "dv-order-prefill";

export type OrderPrefill = {
  fullName?: string;
  phone?: string;
  email?: string;
  note?: string;
};

export function savePrefill(prefill: OrderPrefill) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(prefill));
  } catch {
    // Storage blocked: the form simply starts empty.
  }
}

export function takePrefill(): OrderPrefill | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const out: OrderPrefill = {};
    for (const k of ["fullName", "phone", "email", "note"] as const) {
      const v = (parsed as Record<string, unknown>)[k];
      if (typeof v === "string" && v.trim()) out[k] = v.slice(0, 1500);
    }
    return out;
  } catch {
    return null;
  }
}
