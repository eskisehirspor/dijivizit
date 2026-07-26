import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { User } from "lucide-react";

import { iconForLinkPlatform } from "@/components/card/platform-icons";
import { PublicBankCard } from "@/components/card/public-bank-card";
import { PublicBillingCard } from "@/components/card/public-billing-card";
import { PublicCvCard } from "@/components/card/public-cv-card";
import { Button } from "@/components/ui/button";
import { getAvatarUrl, getPublicCard } from "@/lib/dal/public-card";
import { displayValueForPublicLink } from "@/lib/profile/link-display";
import { hrefForPublicLink } from "@/lib/profile/link-href";
import { hasContactPlatformLabel } from "@/lib/profile/platforms";
import { visiblePublicContactLinks } from "@/lib/profile/public-contacts";
import { clientEnv } from "@/lib/env/client";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type PublicCardPageProps = {
  params: Promise<{ publicId: string }>;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toLocaleUpperCase("tr-TR");
  }
  const first = parts[0]![0] ?? "";
  const last = parts[parts.length - 1]![0] ?? "";
  return `${first}${last}`.toLocaleUpperCase("tr-TR");
}

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

  const [avatarUrl, platforms, t] = await Promise.all([
    getAvatarUrl(card.avatarPath),
    getTranslations("profile.links.platforms"),
    getTranslations("card"),
  ]);

  const headline = [card.title, card.company].filter(Boolean).join(" · ");
  const initials = card.fullName ? initialsFromName(card.fullName) : null;
  const publicUrl = `${clientEnv.NEXT_PUBLIC_SITE_URL}${routes.publicCard(card.publicId)}`;
  const contactLinks = visiblePublicContactLinks(card.links, publicUrl, card.address);

  return (
    <div className="flex min-h-full flex-1 justify-center px-6 py-12 sm:py-16">
      <div className="flex w-full max-w-sm animate-rise flex-col gap-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="size-[200px] shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border/60">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote storage URLs; next/image failed in-app
              <img
                src={avatarUrl}
                alt={card.fullName ?? ""}
                width={200}
                height={200}
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-muted-foreground">
                {initials ? (
                  <span className="text-3xl font-medium tracking-wide">{initials}</span>
                ) : (
                  <User aria-hidden="true" className="size-10" />
                )}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            {card.fullName ? (
              <h1 className="text-2xl font-semibold tracking-tight text-balance">
                {card.fullName}
              </h1>
            ) : null}
            {headline ? (
              <p className="text-sm text-pretty text-muted-foreground">{headline}</p>
            ) : null}
          </div>

          {card.about ? (
            <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
              {card.about}
            </p>
          ) : null}

          <Button asChild className="h-14 w-full rounded-lg px-6 text-base">
            <a href={routes.publicVcard(card.publicId)}>{t("saveContact")}</a>
          </Button>
        </div>

        {contactLinks.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {contactLinks.map((link) => {
              const href = hrefForPublicLink(link.platform, link.value);
              const platformLabel = hasContactPlatformLabel(link.platform)
                ? platforms(
                    link.platform as
                      | "phone"
                      | "email"
                      | "website"
                      | "address"
                      | "linkedin"
                      | "instagram"
                      | "x"
                      | "whatsapp",
                  )
                : link.platform;
              const secondary = displayValueForPublicLink(link.platform, link.value);
              const showSecondary = Boolean(secondary && secondary !== platformLabel);
              const Icon = iconForLinkPlatform(link.platform);
              const external = link.platform !== "phone" && link.platform !== "email";

              return (
                <li key={`${link.platform}-${link.value}`}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-lg border border-border/60 px-4 py-3 text-left transition-colors",
                      "hover:border-border hover:bg-muted/40",
                      "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{platformLabel}</span>
                      {showSecondary ? (
                        <span
                          className={cn(
                            "mt-0.5 block text-xs text-muted-foreground",
                            link.platform === "address"
                              ? "text-pretty whitespace-pre-line"
                              : "truncate",
                          )}
                        >
                          {secondary}
                        </span>
                      ) : null}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        ) : null}

        {card.bankAccount ? (
          <PublicBankCard
            accountHolder={card.bankAccount.accountHolder}
            iban={card.bankAccount.iban}
            bankName={card.bankAccount.bankName}
          />
        ) : null}

        {card.billingInfo ? (
          <PublicBillingCard
            companyTitle={card.billingInfo.companyTitle}
            companyAddress={card.billingInfo.companyAddress}
            taxNumber={card.billingInfo.taxNumber}
            taxOffice={card.billingInfo.taxOffice}
          />
        ) : null}

        {card.cv ? <PublicCvCard viewHref={routes.publicCv(card.publicId)} /> : null}

        {card.skills.length > 0 ? (
          <ul className="flex flex-wrap justify-center gap-2">
            {card.skills.map((skill) => (
              <li
                key={`${skill.type}-${skill.name}`}
                className="rounded-lg border border-border/60 px-3 py-1.5 text-xs text-muted-foreground"
              >
                {skill.name}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
