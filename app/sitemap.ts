import type { MetadataRoute } from "next";

import { MARKETING_ORIGIN } from "@/lib/hosts";
import { GUIDES } from "@/lib/marketing/guides";
import { FINISHES } from "@/lib/orders/finishes";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${MARKETING_ORIGIN}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [`${MARKETING_ORIGIN}/landing/finishes/black.webp`],
    },
    {
      url: `${MARKETING_ORIGIN}/siparis`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${MARKETING_ORIGIN}/kartvizit`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...FINISHES.map((f) => ({
      url: `${MARKETING_ORIGIN}/kartvizit/${f.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: [`${MARKETING_ORIGIN}/landing/finishes/${f.id}.webp`],
    })),
    {
      url: `${MARKETING_ORIGIN}/rehber`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...GUIDES.map((g) => ({
      url: `${MARKETING_ORIGIN}/rehber/${g.slug}`,
      lastModified: new Date(g.published),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: [`${MARKETING_ORIGIN}${g.image}`],
    })),
  ];
}
