import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { InviteCreateForm } from "@/components/dashboard/invite-create-form";
import { listInvitationCodes, requireInviteOwner } from "@/lib/dal/invitations";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("dashboard.invites");
  return { title: t("title") };
}

export default async function InvitesPage() {
  await requireInviteOwner();

  const [t, invitations] = await Promise.all([
    getTranslations("dashboard.invites"),
    listInvitationCodes(),
  ]);

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

      <section className="flex flex-col gap-4 rounded-lg border border-border/60 p-6">
        <h2 className="text-sm font-medium">{t("createTitle")}</h2>
        <InviteCreateForm />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium">{t("listTitle")}</h2>
        {invitations.length === 0 ? (
          <p className="text-sm text-pretty text-muted-foreground">{t("empty")}</p>
        ) : (
          <ul className="grid gap-3">
            {invitations.map((invitation) => (
              <li
                key={invitation.id}
                className="flex flex-col gap-1 rounded-lg border border-border/60 p-4"
              >
                <p className="text-sm font-medium">{invitation.email ?? t("unbound")}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {t("usage", { current: invitation.useCount, max: invitation.maxUses })}
                  {invitation.expiresAt
                    ? ` · ${t("expires", {
                        date: new Intl.DateTimeFormat("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(invitation.expiresAt)),
                      })}`
                    : ` · ${t("noExpiry")}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
