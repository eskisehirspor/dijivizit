import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

// Avatars are served from Supabase Storage, so next/image needs to be told which
// origin is allowed. Derived from the project URL rather than hardcoded so local,
// staging, and production each work without a config edit.
// `images.domains` is removed in Next.js 16; remotePatterns is the only option.
function supabaseImagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!rawUrl) {
    return [];
  }

  try {
    const { protocol, hostname, port } = new URL(rawUrl);

    return [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        ...(port ? { port } : {}),
        pathname: "/storage/v1/object/public/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  // Browsers that have seen dijivizit.com once always go straight to HTTPS, so
  // networks that hijack plain-HTTP requests can no longer redirect visitors.
  // Long max-age + includeSubDomains + preload qualify for hstspreload.org.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // No one may frame our pages (clickjacking), plugins are off and
          // <base> can't be hijacked. A full script CSP would need nonces for
          // GA and Next's inline scripts, so only the safe directives go here.
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: supabaseImagePatterns(),
    // The local Supabase stack serves storage from 127.0.0.1, which Next.js 16
    // refuses to optimize unless this is explicitly allowed.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
};

export default withNextIntl(nextConfig);
