/**
 * Profession and city pages at dijivizit.com/dijital-kartvizit/<slug>. Each
 * page answers how a dijital kartvizit is used in that job or city, so it is
 * useful on its own rather than a copy of the parent page with a word swapped.
 * Same rules as landings.ts: every claim must match the product.
 */
import type { Landing } from "@/lib/marketing/landings";

const PARENT = { name: "Dijital kartvizit", href: "/dijital-kartvizit" };

export const SEGMENTS: Landing[] = [];

export function getSegment(segment: string): Landing | undefined {
  return SEGMENTS.find((s) => s.slug === `dijital-kartvizit/${segment}`);
}

void PARENT;
