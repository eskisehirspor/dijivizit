import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicCardView } from "@/components/card/public-card-view";
import { getPublicCard } from "@/lib/dal/public-card";

type PublicCardPageProps = {
  params: Promise<{ publicId: string }>;
};

export async function generateMetadata({ params }: PublicCardPageProps): Promise<Metadata> {
  const { publicId } = await params;
  const card = await getPublicCard(publicId);

  if (!card) {
    return { robots: { index: false, follow: false } };
  }

  const title = card.fullName ?? "Dijivizit";
  const description = [card.title, card.company].filter(Boolean).join(" · ");

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "profile" },
  };
}

export default async function PublicCardPage({ params }: PublicCardPageProps) {
  const { publicId } = await params;
  const card = await getPublicCard(publicId);

  if (!card) {
    notFound();
  }

  return <PublicCardView card={card} />;
}
