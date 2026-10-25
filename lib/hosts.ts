/**
 * Production host split.
 *
 * dijivizit.com is marketing. app.dijivizit.com is the application. Localhost
 * and preview deployments match neither, so they keep the previous single-origin
 * behaviour and cannot redirect-loop through production.
 */
export const APP_HOSTNAME = "app.dijivizit.com";
export const APP_ORIGIN = "https://app.dijivizit.com";
export const MARKETING_ORIGIN = "https://dijivizit.com";

const MARKETING_HOSTNAMES = new Set(["dijivizit.com", "www.dijivizit.com"]);

export function isAppHostname(hostname: string): boolean {
  return hostname === APP_HOSTNAME;
}

export function isMarketingHostname(hostname: string): boolean {
  return MARKETING_HOSTNAMES.has(hostname);
}

/**
 * Paths the marketing host must not bounce to the app. `/` is the landing page.
 * `/auth/*` and `/p/*` are excluded from the proxy matcher as well; this keeps
 * the same contract if the matcher ever changes.
 */
export function shouldPassThroughOnMarketingHost(pathname: string): boolean {
  if (pathname === "/") {
    return true;
  }

  if (pathname === "/auth" || pathname.startsWith("/auth/")) {
    return true;
  }

  if (pathname === "/p" || pathname.startsWith("/p/")) {
    return true;
  }

  if (pathname.startsWith("/yasal/")) {
    return true;
  }

  if (pathname === "/siparis") {
    return true;
  }

  if (pathname === "/rehber" || pathname.startsWith("/rehber/")) {
    return true;
  }

  return false;
}

/** Absolute URL on the application origin, keeping the path and query string. */
export function appOriginUrl(pathname: string, search = ""): URL {
  return new URL(`${pathname}${search}`, APP_ORIGIN);
}

/** Join a configured origin with a root-relative path. */
export function joinOriginPath(origin: string, path: string): string {
  const trimmed = origin.replace(/\/+$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${trimmed}${normalized}`;
}
