import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CopyUrlButton } from "@/components/dashboard/copy-url-button";
import { PublishToggle } from "@/components/dashboard/publish-toggle";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Badge } from "@/components/ui/badge";
import { formatDay, istanbulToday } from "@/lib/contacts/format";
import { getAuthenticatedUser } from "@/lib/dal/auth";
import { listOwnDueFollowUps } from "@/lib/dal/contacts";
import { viewerIsInviteOwner } from "@/lib/dal/invitations";
import { getOwnProfile } from "@/lib/dal/profile";
import { clientEnv } from "@/lib/env/client";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("dashboard");
  return { title: t("title") };
}

export default async function DashboardPage() {
  const today = istanbulToday();
  const [t, profile, user, due] = await Promise.all([
    getTranslations(),
    getOwnProfile(),
    getAuthenticatedUser(),
    listOwnDueFollowUps(today),
  ]);

  const publicPath = profile ? routes.publicCard(profile.public_id) : null;
  const publicUrl = publicPath ? `${clientEnv.NEXT_PUBLIC_SITE_URL}${publicPath}` : null;
  const isPublished = profile?.is_published ?? false;

  return (
    <div className="flex animate-rise flex-col gap-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          {profile?.full_name
            ? t("dashboard.greeting", { name: profile.full_name })
            : t("dashboard.greetingAnonymous")}
        </h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("dashboard.subtitle")}</p>
        {viewerIsInviteOwner(user?.email) ? (
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3">
            <Link
              href={routes.admin}
              className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
            >
              {t("dashboard.admin.nav")}
            </Link>
            <Link
              href={routes.invites}
              className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
            >
              {t("dashboard.invites.nav")}
            </Link>
          </p>
        ) : null}
      </div>

      <section className="flex flex-col gap-6 rounded-lg border border-border/60 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium">{t("dashboard.cardStatus")}</h2>
          <Badge variant={isPublished ? "default" : "secondary"}>
            {isPublished ? t("dashboard.published") : t("dashboard.draft")}
          </Badge>
        </div>

        {profile ? <PublishToggle published={isPublished} /> : null}

        {publicUrl && publicPath ? (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">{t("dashboard.publicUrl")}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-sm break-all">{publicUrl}</p>
              <CopyUrlButton url={publicUrl} />
            </div>
            {!isPublished ? (
              <p className="text-xs text-pretty text-muted-foreground">
                {t("dashboard.publish.urlDraftHint")}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-pretty text-muted-foreground">{t("dashboard.emptyBody")}</p>
        )}
      </section>

      {due.length > 0 ? (
        <section className="flex flex-col gap-4 rounded-lg border border-border/60 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-medium">{t("dashboard.due.title")}</h2>
            <Link
              href={routes.contacts}
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              {t("dashboard.due.all")}
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {due.map((item) => (
              <li key={item.id}>
                <Link
                  href={routes.contact(item.contactId)}
                  className="flex items-center justify-between gap-4 rounded-lg px-3 py-2 transition-colors hover:bg-muted/40"
                >
                  <span className="min-w-0 truncate text-sm">
                    <span className="font-medium">{item.contactName}</span>
                    {item.note ? (
                      <span className="text-muted-foreground"> · {item.note}</span>
                    ) : null}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {item.dueOn < today
                      ? `${t("dashboard.due.overdue")} · ${formatDay(item.dueOn, today)}`
                      : t("dashboard.due.today")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <QuickActions
        editHref={routes.profileEdit}
        avatarHref={routes.profileAvatar}
        linksHref={routes.profileLinks}
        skillsHref={routes.profileSkills}
        bankHref={routes.profileBank}
        billingHref={routes.profileBilling}
        documentsHref={routes.profileDocuments}
        analyticsHref={routes.analytics}
        shareHref={routes.share}
        contactsHref={routes.contacts}
        cardsHref={routes.cards}
        teamHref={routes.team}
        publicHref={isPublished ? publicPath : profile ? routes.cardPreview : null}
      />
    </div>
  );
}
