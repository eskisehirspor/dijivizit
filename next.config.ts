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
  images: {
    remotePatterns: supabaseImagePatterns(),
    // The local Supabase stack serves storage from 127.0.0.1, which Next.js 16
    // refuses to optimize unless this is explicitly allowed.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
};

export default withNextIntl(nextConfig);
