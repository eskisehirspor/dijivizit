import type { MetadataRoute } from "next";

import { MARKETING_ORIGIN } from "@/lib/hosts";
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
    ...LEGAL_SLUGS.map((slug) => ({
      url: `${MARKETING_ORIGIN}/yasal/${slug}`,
      lastModified: new Date(LEGAL_VERSION),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
