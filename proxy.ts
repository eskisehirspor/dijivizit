import { NextResponse, type NextRequest } from "next/server";

import {
  appOriginUrl,
  isAppHostname,
  isMarketingHostname,
  shouldPassThroughOnMarketingHost,
} from "@/lib/hosts";
import { AUTH_ENTRY_ROUTES, PROTECTED_PREFIXES, routes } from "@/lib/routes";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Renamed from `middleware` in Next.js 16. Runs on the Node.js runtime.
 *
 * This layer refreshes the Supabase session and handles coarse redirects. It is
 * NOT the authorization boundary: Server Actions are POSTs to the route that
 * hosts them, so a matcher change can silently drop coverage. Every read and
 * mutation re-checks the caller through lib/dal.
 *
 * Production hosts: dijivizit.com is marketing; app.dijivizit.com is the app.
 * Localhost and preview deployments are neither, so they keep single-origin
 * behaviour (marketing on /, auth and dashboard on the same host).
 */
export async function proxy(request: NextRequest) {
  const { response, claims } = await updateSession(request);
  const { pathname, hostname, search, origin } = request.nextUrl;

  const isAuthenticated = claims !== null;

  if (isMarketingHostname(hostname)) {
    if (shouldPassThroughOnMarketingHost(pathname)) {
      return response;
    }

    return NextResponse.redirect(appOriginUrl(pathname, search));
  }

  if (isAppHostname(hostname) && pathname === "/") {
    const destination = new URL(isAuthenticated ? routes.dashboard : routes.login, origin);
    return NextResponse.redirect(destination);
  }

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = routes.login;
    url.search = "";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && AUTH_ENTRY_ROUTES.some((route) => pathname === route)) {
    const url = request.nextUrl.clone();
    url.pathname = routes.dashboard;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Skips static assets, the auth callback handlers (which manage their own
    // cookies), and public cards under /p/ — those must stay anonymous and
    // cacheable, and never touch the session.
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|p/|auth/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
