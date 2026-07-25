import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getAvatarUrl, getPublicCard } from "@/lib/dal/public-card";

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
    // Unguessable URLs only stay unguessable if they never enter a search index.
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

  const avatarUrl = await getAvatarUrl(card.avatarPath);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center px-6 py-24">
      <div className="flex animate-rise flex-col items-center gap-7 text-center">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={card.fullName ?? ""}
            width={96}
            height={96}
            className="size-24 rounded-full object-cover ring-1 ring-border"
            priority
          />
        ) : null}

        <div className="flex flex-col gap-1.5">
          {card.fullName ? <h1 className="text-2xl font-semibold">{card.fullName}</h1> : null}

          {card.title || card.company ? (
            <p className="text-sm text-muted-foreground">
              {[card.title, card.company].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </div>

        {card.about ? (
          <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{card.about}</p>
        ) : null}
      </div>
    </div>
  );
}
