const VISITOR_ID_KEY = "dijivizit_vid";

/** Stable anonymous visitor id for analytics (localStorage). Safe for SSR. */
export function getOrCreateVisitorId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const existing = window.localStorage.getItem(VISITOR_ID_KEY);
    if (existing && existing.length > 0 && existing.length <= 64) {
      return existing;
    }

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

    window.localStorage.setItem(VISITOR_ID_KEY, id);
    return id;
  } catch {
    return null;
  }
}
