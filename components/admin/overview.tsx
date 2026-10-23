import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Funnel } from "@/components/admin/funnel";
import { InvitationList } from "@/components/admin/invitation-list";
import { StatTile } from "@/components/admin/stat-tile";
import { UserList } from "@/components/admin/user-list";
import { percentOf } from "@/lib/admin/format";
import { ACTIVE_WINDOW_DAYS, buildOverview, type InvitationStatus } from "@/lib/admin/summary";
import type { AdminData } from "@/lib/dal/admin";
import { routes } from "@/lib/routes";

const RECENT_INVITATIONS = 5;
const STATUSES: InvitationStatus[] = ["active", "used", "expired", "revoked"];

export async function AdminOverviewView({ users, invitations }: AdminData) {
  const t = await getTranslations("dashboard.admin");

  const overview = buildOverview(users);
  const days = ACTIVE_WINDOW_DAYS;

  const invitationCounts = Object.fromEntries(
    STATUSES.map((status) => [status, invitations.filter((item) => item.status === status).length]),
  ) as Record<InvitationStatus, number>;

  return (
    <div className="flex animate-rise flex-col gap-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t("title")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("subtitle")}</p>
        <p className="pt-3">
          <Link
            href={routes.dashboard}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("backToDashboard")}
          </Link>
        </p>
      </div>

      <section aria-label={t("title")}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <li>
            <StatTile
              label={t("stats.users")}
              value={overview.totalUsers}
              hint={t("stats.usersHint", { days, count: overview.newUsersRecent })}
            />
          </li>
          <li>
            <StatTile
              label={t("stats.published")}
              value={overview.publishedCards}
              hint={t("stats.publishedHint", {
                percent: percentOf(overview.publishedCards, overview.totalUsers),
              })}
            />
          </li>
          <li>
            <StatTile
              label={t("stats.active")}
              value={overview.activeUsers}
              hint={t("stats.activeHint", { days })}
            />
          </li>
          <li>
            <StatTile
              label={t("stats.views")}
              value={overview.viewsTotal}
              hint={t("stats.viewsHint", { days, count: overview.viewsRecent })}
            />
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-6 rounded-lg border border-border/60 p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium">{t("funnel.title")}</h2>
          <p className="text-sm text-pretty text-muted-foreground">{t("funnel.subtitle")}</p>
        </div>
        <Funnel
          steps={[
            { key: "registered", label: t("funnel.registered"), value: overview.funnel.registered },
            { key: "filled", label: t("funnel.filled"), value: overview.funnel.filled },
            { key: "published", label: t("funnel.published"), value: overview.funnel.published },
            { key: "viewed", label: t("funnel.viewed"), value: overview.funnel.viewed },
          ]}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium">{t("users.title")}</h2>
        <UserList users={users} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-sm font-medium">{t("invites.title")}</h2>
            <p className="text-xs text-muted-foreground tabular-nums">
              {STATUSES.map(
                (status) => `${t(`invites.summary.${status}`)} ${invitationCounts[status]}`,
              ).join(" · ")}
            </p>
          </div>
          <Link
            href={routes.invites}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("invites.manage")}
          </Link>
        </div>
        <InvitationList invitations={invitations.slice(0, RECENT_INVITATIONS)} />
      </section>
    </div>
  );
}
