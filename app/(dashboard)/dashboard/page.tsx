import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { InviteCreateForm } from "@/components/dashboard/invite-create-form";
import { InviteRevokeButton } from "@/components/dashboard/invite-revoke-button";
import {
  listInvitationCodes,
  requireInviteOwner,
} from "@/lib/dal/invitations";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("dashboard.invites");
  return { title: t("title") };
}

function getInvitationStatus(
  invitation: {
    useCount: number;
    maxUses: number;
    expiresAt: string | null;
    revokedAt: string | null;
  },
) {
  if (invitation.revokedAt) {
    return "revoked";
  }

  if (invitation.useCount >= invitation.maxUses) {
    return "used";
  }

  if (
    invitation.expiresAt &&
    new Date(invitation.expiresAt).getTime() <= Date.now()
  ) {
    return "expired";
  }

  return "active";
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
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          {t("title")}
        </h1>

        <p className="text-sm text-pretty text-muted-foreground">
          {t("subtitle")}
        </p>

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
          <p className="text-sm text-pretty text-muted-foreground">
            {t("empty")}
          </p>
        ) : (
          <ul className="grid gap-3">
            {invitations.map((invitation) => {
              const status = getInvitationStatus(invitation);

              return (
                <li
                  key={invitation.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/60 p-4"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">
                      {invitation.email ?? t("unbound")}
                    </p>

                    <p className="text-xs text-muted-foreground tabular-nums">
                      {t("usage", {
                        current: invitation.useCount,
                        max: invitation.maxUses,
                      })}

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
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-medium">
                      {t(`status.${status}`)}
                    </span>

                    {status === "active" ? (
                      <InviteRevokeButton invitationId={invitation.id} />
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}