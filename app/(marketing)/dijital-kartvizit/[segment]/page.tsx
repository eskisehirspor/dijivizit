import { notFound } from "next/navigation";

import { LandingPage, landingMetadata } from "@/components/marketing/landing-page";
import { SEGMENTS, getSegment } from "@/lib/marketing/segments";

type Params = { params: Promise<{ segment: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SEGMENTS.map((s) => ({ segment: s.slug.split("/")[1]! }));
}

export async function generateMetadata({ params }: Params) {
  const s = getSegment((await params).segment);
  return s ? landingMetadata(s) : {};
}

export default async function SegmentPage({ params }: Params) {
  const s = getSegment((await params).segment);
  if (!s) notFound();
  return <LandingPage landing={s} />;
}
