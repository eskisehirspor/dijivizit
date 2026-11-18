import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";

import { PublicCardView } from "@/components/card/public-card-view";
import { getPublicCard } from "@/lib/dal/public-card";
import { cardLocaleFromAcceptLanguage, messagesFor } from "@/lib/i18n/messages";

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

  const locale = cardLocaleFromAcceptLanguage((await headers()).get("accept-language"));

  if (locale === "tr") {
    return <PublicCardView card={card} />;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messagesFor(locale) as never}>
      <div lang="en" className="contents">
        <PublicCardView card={card} locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}
