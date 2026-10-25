import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CardList, NewCardForm } from "@/components/cards/card-list";
import {
  AcceptInviteButton,
  CreateTeamForm,
  InviteForm,
  LeaveOrDeleteTeam,
  MemberControls,
  RenameTeamForm,
  RevokeInviteButton,
} from "@/components/team/team-controls";
import { Badge } from "@/components/ui/badge";
import { displayPhone, formatDay } from "@/lib/contacts/format";
import { requireUser } from "@/lib/dal/auth";
import { getTeamDetail, listMyTeamInvites, listMyTeams } from "@/lib/dal/team";
import { clientEnv } from "@/lib/env/client";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export async function generateMetadata() {
  const t = await getTranslations("team");
  return { title: t("title") };
}

const linkClass =
  "text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground";

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ ekip?: string }>;
}) {
  const { ekip } = await searchParams;
  const user = await requireUser();
  const [t, teams, invites] = await Promise.all([
    getTranslations("team"),
    listMyTeams(),
    listMyTeamInvites(),
  ]);
  const team = teams.find((x) => x.id === ekip) ?? teams[0] ?? null;
  const detail = team ? await getTeamDetail(team) : null;
  const isAdmin = team ? team.role !== "member" : false;
  const base = clientEnv.NEXT_PUBLIC_SITE_URL;

  return (
    <div className="flex animate-rise flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          {team ? team.name : t("title")}
        </h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("subtitle")}</p>
        <p className="flex flex-wrap gap-x-4 gap-y-2 pt-3">
          <Link href={routes.dashboard} className={linkClass}>
            {t("back")}
          </Link>
          {teams.length > 1
            ? teams.map((x) => (
                <Link
                  key={x.id}
                  href={`${routes.team}?ekip=${x.id}`}
                  className={cn(linkClass, x.id === team?.id && "no-underline")}
                >
                  {x.name}
                </Link>
              ))
            : null}
        </p>
      </div>

      {invites.length > 0 ? (
        <section className="flex flex-col gap-3 rounded-lg border border-foreground/30 p-6">
          <h2 className="text-sm font-medium">{t("pendingTitle")}</h2>
          <ul className="flex flex-col gap-2">
            {invites.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between gap-4">
                <span className="text-sm">
                  <span className="font-medium">{inv.orgName}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {t(`roles.${inv.role}` as never)}
                  </span>
                </span>
                <AcceptInviteButton inviteId={inv.id} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!team || !detail ? (
        <section className="flex flex-col gap-4 rounded-lg border border-border/60 p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-medium">{t("createTitle")}</h2>
            <p className="text-xs text-pretty text-muted-foreground">{t("createBody")}</p>
          </div>
          <CreateTeamForm />
        </section>
      ) : (
        <>
          {isAdmin ? (
            <section className="flex flex-col gap-3 rounded-lg border border-border/60 p-6">
              <h2 className="text-sm font-medium">{t("nameLabel")}</h2>
              <RenameTeamForm orgId={team.id} name={team.name} />
            </section>
          ) : null}

          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-medium">
              {t("membersTitle", { count: detail.members.length })}
            </h2>
            <ul className="flex flex-col divide-y divide-border/60 rounded-lg border border-border/60">
              {detail.members.map((m) => (
                <li
                  key={m.userId}
                  className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <span className="truncate">{m.fullName || m.email}</span>
                      {!m.isPublished ? (
                        <Badge variant="outline" className="shrink-0">
                          {t("draft")}
                        </Badge>
                      ) : null}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {[m.title, m.email].filter(Boolean).join(" · ")}
                    </p>
                    {isAdmin ? (
                      <p className="pt-1 text-xs text-muted-foreground">
                        {t("memberStats", {
                          cards: m.cards,
                          views: m.views30d,
                          contacts: m.contacts,
                        })}
                      </p>
                    ) : null}
                  </div>
                  <MemberControls
                    orgId={team.id}
                    userId={m.userId}
                    role={m.role}
                    canManage={isAdmin}
                    isSelf={m.userId === user.id}
                  />
                </li>
              ))}
            </ul>
          </section>

          {isAdmin ? (
            <section className="flex flex-col gap-4 rounded-lg border border-border/60 p-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-medium">{t("inviteTitle")}</h2>
                <p className="text-xs text-pretty text-muted-foreground">{t("inviteBody")}</p>
              </div>
              <InviteForm orgId={team.id} />
              {detail.invites.length > 0 ? (
                <ul className="flex flex-col gap-1 pt-2">
                  {detail.invites.map((inv) => (
                    <li key={inv.id} className="flex items-center justify-between gap-4 text-sm">
                      <span className="truncate">
                        {inv.email}
                        <span className="text-muted-foreground">
                          {" "}
                          · {t(`roles.${inv.role}` as never)} · {t("invitePending")}
                        </span>
                      </span>
                      <RevokeInviteButton inviteId={inv.id} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}

          {isAdmin ? (
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-medium">
                  {t("cardsTitle", { count: detail.cards.length })}
                </h2>
                <p className="text-xs text-pretty text-muted-foreground">{t("cardsBody")}</p>
              </div>
              <NewCardForm orgId={team.id} bulk />
              <CardList
                cards={detail.cards}
                baseUrl={base}
                mode="team"
                members={detail.members.map((m) => ({
                  userId: m.userId,
                  name: m.fullName || m.email,
                }))}
              />
            </section>
          ) : null}

          {isAdmin ? (
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-medium">{t("contactsTitle")}</h2>
                <p className="text-xs text-pretty text-muted-foreground">{t("contactsBody")}</p>
              </div>
              {detail.contacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("contactsEmpty")}</p>
              ) : (
                <ul className="flex flex-col divide-y divide-border/60 rounded-lg border border-border/60">
                  {detail.contacts.map((c) => (
                    <li key={c.id} className="flex flex-col gap-0.5 px-5 py-3">
                      <p className="text-sm font-medium">
                        {c.full_name}
                        {c.company ? (
                          <span className="font-normal text-muted-foreground"> · {c.company}</span>
                        ) : null}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {[c.phone ? displayPhone(c.phone) : null, c.email]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("collectedBy", { name: c.collectedBy, date: formatDay(c.created_at) })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : null}

          <LeaveOrDeleteTeam orgId={team.id} isOwner={team.role === "owner"} />
        </>
      )}
    </div>
  );
}
