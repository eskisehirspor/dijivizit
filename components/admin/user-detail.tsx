import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Check, ExternalLink, Minus } from "lucide-react";

import { UserAvatar } from "@/components/admin/user-avatar";
import { CompletenessBar } from "@/components/admin/user-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatRelative } from "@/lib/admin/format";
import { ACTIVE_WINDOW_DAYS, COMPLETENESS_KEYS } from "@/lib/admin/summary";
import type { AdminUserDetail } from "@/lib/dal/admin";
import { clientEnv } from "@/lib/env/client";
import { displayValueForPublicLink } from "@/lib/profile/link-display";
import { routes } from "@/lib/routes";
import { ANALYTICS_EVENT_TYPES } from "@/lib/validations/analytics";
import { cn } from "@/lib/utils";

export async function AdminUserDetailView({ user }: { user: AdminUserDetail }) {
  const [t, tRoot] = await Promise.all([getTranslations("dashboard.admin"), getTranslations()]);

  const headline = [user.title, user.company].filter(Boolean).join(" · ");
  const cardPath = user.publicId ? routes.publicCard(user.publicId) : null;
  const cardUrl = cardPath ? `${clientEnv.NEXT_PUBLIC_SITE_URL}${cardPath}` : null;

  const platformLabel = (platform: string) =>
    tRoot.has(`profile.links.platforms.${platform}`)
      ? tRoot(`profile.links.platforms.${platform}`)
      : platform.charAt(0).toLocaleUpperCase("tr-TR") + platform.slice(1);

  const providerLabel = t.has(`detail.providers.${user.provider}`)
    ? t(`detail.providers.${user.provider}`)
    : user.provider;

  const invitationLabel = user.invitation
    ? user.invitation.email
      ? t("detail.invitationBound", {
          email: user.invitation.email,
          date: formatDate(user.invitation.redeemedAt),
        })
      : t("detail.invitationGeneric", { date: formatDate(user.invitation.redeemedAt) })
    : t("detail.invitationNone");

  const accountRows: { label: string; value: React.ReactNode; mono?: boolean }[] = [
    { label: t("detail.fields.email"), value: user.email ?? "—" },
    { label: t("detail.fields.joined"), value: formatDate(user.createdAt) },
    {
      label: t("detail.fields.lastSignIn"),
      value: user.lastSignInAt
        ? `${formatDate(user.lastSignInAt)} · ${formatRelative(user.lastSignInAt)}`
        : t("detail.never"),
    },
    { label: t("detail.fields.provider"), value: providerLabel },
    {
      label: t("detail.fields.confirmed"),
      value: user.emailConfirmed ? t("detail.yes") : t("detail.no"),
    },
    { label: t("detail.fields.invitation"), value: invitationLabel },
    { label: t("detail.fields.cardUrl"), value: cardUrl ?? "—", mono: true },
  ];

  const eventTypes = ANALYTICS_EVENT_TYPES.filter((type) => (user.eventCounts[type] ?? 0) > 0);

  return (
    <div className="flex animate-rise flex-col gap-12">
      <div className="flex flex-col gap-6">
        <p>
          <Link
            href={routes.admin}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("backToAdmin")}
          </Link>
        </p>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <UserAvatar
              name={user.fullName}
              email={user.email}
              url={user.avatarUrl}
              className="size-16 text-base"
            />
            <div className="flex min-w-0 flex-col gap-1.5">
              <h1 className="truncate text-2xl font-semibold tracking-tight">
                {user.fullName?.trim() || t("users.noName")}
              </h1>
              {headline ? (
                <p className="truncate text-sm text-muted-foreground">{headline}</p>
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={user.cardState === "published" ? "default" : "secondary"}>
                  {t(`users.state.${user.cardState}`)}
                </Badge>
                {user.isOwner ? <Badge variant="outline">{t("users.owner")}</Badge> : null}
                {user.isActive ? (
                  <span className="text-xs text-muted-foreground">
                    {t("stats.activeHint", { days: ACTIVE_WINDOW_DAYS })}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {user.isPublished && cardPath ? (
            <Button asChild className="h-10 w-fit shrink-0">
              <a href={cardPath} target="_blank" rel="noopener noreferrer">
                {t("detail.openCard")}
                <ExternalLink aria-hidden="true" className="size-4" />
              </a>
            </Button>
          ) : null}
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <Metric label={t("detail.viewsTotal")} value={user.viewsTotal} />
        <Metric
          label={t("detail.viewsRecent", { days: ACTIVE_WINDOW_DAYS })}
          value={user.viewsRecent}
        />
        <Metric label={t("detail.interactions")} value={user.interactionsTotal} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium">{t("detail.account")}</h2>
        <dl className="divide-y divide-border/60 rounded-lg border border-border/60">
          {accountRows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-6 sm:px-5"
            >
              <dt className="text-xs font-medium text-muted-foreground sm:w-36 sm:shrink-0">
                {row.label}
              </dt>
              <dd className={cn("min-w-0 text-sm break-words", row.mono && "font-mono break-all")}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-sm font-medium">{t("detail.completeness")}</h2>
          <div className="w-32">
            <CompletenessBar
              percent={user.completenessPercent}
              label={t("users.completeness", { percent: user.completenessPercent })}
            />
          </div>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {COMPLETENESS_KEYS.map((key) => {
            const done = user.completeness[key];
            return (
              <li key={key} className="flex items-center gap-3 text-sm">
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full",
                    done ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? (
                    <Check aria-hidden="true" className="size-3" strokeWidth={2.5} />
                  ) : (
                    <Minus aria-hidden="true" className="size-3" />
                  )}
                </span>
                <span className={done ? undefined : "text-muted-foreground"}>
                  {t(`detail.checks.${key}`)}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-sm font-medium">{t("detail.content")}</h2>

        {user.about?.trim() ? (
          <ContentBlock title={t("detail.about")}>
            <p className="text-sm text-pretty whitespace-pre-line">{user.about}</p>
          </ContentBlock>
        ) : null}

        {user.address?.trim() ? (
          <ContentBlock title={t("detail.address")}>
            <p className="text-sm text-pretty">{user.address}</p>
          </ContentBlock>
        ) : null}

        <ContentBlock title={t("detail.links")}>
          {user.links.length === 0 ? (
            <Empty>{t("detail.nothing")}</Empty>
          ) : (
            <ul className="divide-y divide-border/60 rounded-lg border border-border/60">
              {user.links.map((link) => (
                <li
                  key={link.id}
                  className="flex items-baseline justify-between gap-4 px-4 py-3 sm:px-5"
                >
                  <span className="shrink-0 text-xs font-medium text-muted-foreground">
                    {link.label?.trim() || platformLabel(link.platform)}
                  </span>
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span className="truncate text-sm">
                      {displayValueForPublicLink(link.platform, link.value) ?? link.value}
                    </span>
                    {!link.isVisible ? (
                      <Badge variant="outline" className="shrink-0">
                        {t("detail.hidden")}
                      </Badge>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </ContentBlock>

        <ContentBlock title={t("detail.skills")}>
          {user.skills.length === 0 ? (
            <Empty>{t("detail.nothing")}</Empty>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <li key={skill.id}>
                  <Badge variant="secondary">{skill.name}</Badge>
                </li>
              ))}
            </ul>
          )}
        </ContentBlock>

        <ContentBlock title={t("detail.documents")}>
          {user.documents.length === 0 ? (
            <Empty>{t("detail.nothing")}</Empty>
          ) : (
            <ul className="flex flex-col gap-2">
              {user.documents.map((document) => (
                <li key={document.id} className="flex items-baseline gap-2 text-sm">
                  <span className="truncate">{document.title}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {document.fileName}
                  </span>
                  {!document.isVisible ? (
                    <Badge variant="outline" className="shrink-0">
                      {t("detail.hidden")}
                    </Badge>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </ContentBlock>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-border/60 p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium">{t("detail.sensitive")}</h2>
          <p className="text-xs text-pretty text-muted-foreground">{t("detail.sensitiveHint")}</p>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          <PresenceRow label={t("detail.bank")} present={user.hasBankAccount} t={t} />
          <PresenceRow label={t("detail.billing")} present={user.hasBillingInfo} t={t} />
        </dl>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-medium">{t("detail.stats")}</h2>
          {user.lastViewAt ? (
            <p className="text-xs text-muted-foreground">
              {t("detail.fields.lastView")}: {formatRelative(user.lastViewAt)}
            </p>
          ) : null}
        </div>
        {eventTypes.length === 0 ? (
          <Empty>{t("detail.noEvents")}</Empty>
        ) : (
          <ul className="divide-y divide-border/60 rounded-lg border border-border/60">
            {eventTypes.map((type) => (
              <li
                key={type}
                className="flex items-baseline justify-between gap-4 px-4 py-3 sm:px-5"
              >
                <span className="text-sm">{tRoot(`dashboard.analytics.events.types.${type}`)}</span>
                <span className="text-sm font-medium tabular-nums">{user.eventCounts[type]}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
    </div>
  );
}

function ContentBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-pretty text-muted-foreground">{children}</p>;
}

function PresenceRow({
  label,
  present,
  t,
}: {
  label: string;
  present: boolean;
  t: (key: "detail.entered" | "detail.notEntered") => string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 px-4 py-3">
      <dt className="text-sm">{label}</dt>
      <dd>
        <Badge variant={present ? "default" : "outline"}>
          {present ? t("detail.entered") : t("detail.notEntered")}
        </Badge>
      </dd>
    </div>
  );
}
