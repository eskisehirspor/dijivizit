import type { CSSProperties, ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { User } from "lucide-react";

import { LeaveContact } from "@/components/card/leave-contact";
import { iconForLinkPlatform } from "@/components/card/platform-icons";
import { PublicBankCard } from "@/components/card/public-bank-card";
import { PublicBillingCard } from "@/components/card/public-billing-card";
import { PublicDocumentsSection } from "@/components/card/public-documents-section";
import { PublicProductsSection } from "@/components/card/public-products-section";
import { PublicShareMenu } from "@/components/card/public-share-menu";
import { PublicSkillsSection } from "@/components/card/public-skills-section";
import { TrackProfileView } from "@/components/card/track-profile-view";
import { TrackedPublicLink } from "@/components/card/tracked-public-link";
import { Button } from "@/components/ui/button";
import { getAvatarUrl } from "@/lib/dal/public-card";
import { displayValueForPublicLink } from "@/lib/profile/link-display";
import { hrefForPublicLink } from "@/lib/profile/link-href";
import { hasContactPlatformLabel } from "@/lib/profile/platforms";
import { visiblePublicContactLinks } from "@/lib/profile/public-contacts";
import type { PublicCard } from "@/lib/validations/card";
import {
  DEFAULT_SKILLS_SECTION_TITLE,
  isSkillsSectionTitle,
} from "@/lib/profile/skills-section-title";
import { clientEnv } from "@/lib/env/client";
import { MARKETING_ORIGIN } from "@/lib/hosts";
import { routes } from "@/lib/routes";
import type { Locale } from "@/lib/i18n/config";
import { cardTheme } from "@/lib/profile/themes";
import { cn } from "@/lib/utils";

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

/**
 * The card as visitors see it. `preview` renders the owner's draft: no view
 * tracking, no share menu, document links go to the owner-only route.
 */
export async function PublicCardView({
  card,
  preview = false,
  banner,
  locale = "tr",
}: {
  card: PublicCard;
  preview?: boolean;
  banner?: ReactNode;
  locale?: Locale;
}) {
  // Inside the dashboard layout there is already a <main>.
  const Wrapper = preview ? "div" : "main";
  const [avatarUrl, coverUrl, platforms, t] = await Promise.all([
    getAvatarUrl(card.avatarPath),
    getAvatarUrl(card.coverPath ?? null),
    getTranslations({ locale, namespace: "profile.links.platforms" }),
    getTranslations({ locale, namespace: "card" }),
  ]);

  const headline = [card.title, card.company].filter(Boolean).join(" · ");
  const initials = card.fullName ? initialsFromName(card.fullName) : null;
  const publicUrl = `${clientEnv.NEXT_PUBLIC_SITE_URL}${routes.publicCard(card.publicId)}`;
  const contactLinks = visiblePublicContactLinks(card.links, publicUrl, card.address);
  const theme = cardTheme(card.theme);
  const themed = theme.id !== "default";
  const themeStyle = themed
    ? ({ "--primary": theme.accent, "--primary-foreground": theme.accentText } as CSSProperties)
    : undefined;

  return (
    <Wrapper
      className={cn(
        "flex min-h-full flex-1 justify-center px-6 py-12 sm:py-16",
        theme.dark && "dark bg-background text-foreground",
        coverUrl && "pt-0 sm:pt-0",
      )}
      style={themeStyle}
    >
      {preview ? null : <TrackProfileView publicId={card.publicId} />}
      <div className="flex w-full max-w-sm animate-rise flex-col gap-10">
        {banner}
        {coverUrl ? (
          <div className="-mx-6 -mb-24 aspect-[3/1] overflow-hidden sm:mx-0 sm:mt-8 sm:rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element -- remote storage URL */}
            <img src={coverUrl} alt="" className="size-full object-cover" />
          </div>
        ) : null}
        <div className="relative flex flex-col items-center gap-6 text-center">
          {preview ? null : (
            <div className="absolute top-0 right-0">
              <PublicShareMenu publicId={card.publicId} publicUrl={publicUrl} />
            </div>
          )}
          <div
            className={cn(
              "size-[200px] shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border/60",
              coverUrl && "size-[160px] ring-4 ring-background",
            )}
          >
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

          <div className="flex w-full flex-col gap-3">
            <Button asChild className="h-14 w-full rounded-lg px-6 text-base">
              <a
                href={preview ? undefined : routes.publicVcard(card.publicId)}
                aria-disabled={preview || undefined}
              >
                {t("saveContact")}
              </a>
            </Button>
            {preview ? null : <LeaveContact publicId={card.publicId} ownerName={card.fullName} />}
          </div>
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
              // An owner-set label ("İş", "Cep") names the row; the platform
              // name is the fallback.
              const rowLabel = link.label?.trim() || platformLabel;
              const secondary = displayValueForPublicLink(link.platform, link.value);
              const showSecondary = Boolean(secondary && secondary !== rowLabel);
              const Icon = iconForLinkPlatform(link.platform);
              const external = link.platform !== "phone" && link.platform !== "email";

              return (
                <li key={`${link.platform}-${link.value}`}>
                  <TrackedPublicLink
                    publicId={card.publicId}
                    platform={link.platform}
                    href={href}
                    external={external}
                    track={!preview}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-lg border border-border/60 px-4 py-3 text-left transition-colors",
                      "hover:border-border hover:bg-muted/40",
                      "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground",
                        themed && "text-primary",
                      )}
                    >
                      <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{rowLabel}</span>
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
                  </TrackedPublicLink>
                </li>
              );
            })}
          </ul>
        ) : null}

        {card.bankAccount ? (
          <PublicBankCard
            locale={locale}
            accountHolder={card.bankAccount.accountHolder}
            iban={card.bankAccount.iban}
            bankName={card.bankAccount.bankName}
          />
        ) : null}

        {card.billingInfo ? (
          <PublicBillingCard
            locale={locale}
            companyTitle={card.billingInfo.companyTitle}
            companyAddress={card.billingInfo.companyAddress}
            taxNumber={card.billingInfo.taxNumber}
            taxOffice={card.billingInfo.taxOffice}
          />
        ) : null}

        <PublicDocumentsSection
          locale={locale}
          publicId={card.publicId}
          documents={card.documents}
          preview={preview}
        />

        <PublicProductsSection locale={locale} products={card.products} />

        <PublicSkillsSection
          locale={locale}
          titleKey={
            isSkillsSectionTitle(card.skillsSectionTitle)
              ? card.skillsSectionTitle
              : DEFAULT_SKILLS_SECTION_TITLE
          }
          skills={card.skills}
        />

        <p className="pt-6 text-center text-xs text-muted-foreground">
          {t.rich("footer", {
            brand: (chunks) => (
              <a
                href={`${MARKETING_ORIGIN}/`}
                className="font-medium text-foreground hover:underline"
              >
                {chunks}
              </a>
            ),
            create: (chunks) => (
              <a
                href={`${MARKETING_ORIGIN}/dijital-kartvizit-olustur`}
                className="underline underline-offset-4 hover:text-foreground"
              >
                {chunks}
              </a>
            ),
            privacy: (chunks) => (
              <a href={routes.legal("gizlilik")} className="underline-offset-4 hover:underline">
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
    </Wrapper>
  );
}
