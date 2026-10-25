import type { MetadataRoute } from "next";

import { MARKETING_ORIGIN } from "@/lib/hosts";
import { GUIDES } from "@/lib/marketing/guides";
import { LEGAL_SLUGS, LEGAL_VERSION } from "@/lib/legal/documents";

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
    ...LEGAL_SLUGS.map((slug) => ({
      url: `${MARKETING_ORIGIN}/yasal/${slug}`,
      lastModified: new Date(LEGAL_VERSION),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
