import type { MetadataRoute } from "next";

import { MARKETING_ORIGIN } from "@/lib/hosts";
import { CONTENT_UPDATED as CONTENT_UPDATED_ISO } from "@/lib/marketing/content-updated";
import { GUIDES } from "@/lib/marketing/guides";
import { LANDINGS } from "@/lib/marketing/landings";
import { SEGMENTS } from "@/lib/marketing/segments";
import { TOOLS } from "@/lib/marketing/tools";
import { FINISHES } from "@/lib/orders/finishes";

/** Bump lib/marketing/content-updated.ts when landing, product, tool or city/profession copy changes. */
const CONTENT_UPDATED = new Date(CONTENT_UPDATED_ISO);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${MARKETING_ORIGIN}/`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${MARKETING_ORIGIN}/landing/finishes/black.webp`],
    },
    ...LANDINGS.map((l) => ({
      url: `${MARKETING_ORIGIN}/${l.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...SEGMENTS.map((l) => ({
      url: `${MARKETING_ORIGIN}/${l.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...TOOLS.map((t) => ({
      url: `${MARKETING_ORIGIN}/${t.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: `${MARKETING_ORIGIN}/dijital-kartvizit-fiyatlari`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${MARKETING_ORIGIN}/hakkimizda`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${MARKETING_ORIGIN}/siparis`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${MARKETING_ORIGIN}/kartvizit`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...FINISHES.map((f) => ({
      url: `${MARKETING_ORIGIN}/kartvizit/${f.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: [`${MARKETING_ORIGIN}/landing/products/${f.id}.webp`],
    })),
    {
      url: `${MARKETING_ORIGIN}/rehber`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...GUIDES.map((g) => ({
      url: `${MARKETING_ORIGIN}/rehber/${g.slug}`,
      lastModified: new Date(g.updated ?? g.published),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: [`${MARKETING_ORIGIN}${g.image}`],
    })),
  ];
}
