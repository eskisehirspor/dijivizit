"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { revokeInvitationAction } from "@/app/actions/invitations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/admin/format";
import type { InvitationStatus } from "@/lib/admin/summary";
import type { AdminInvitation } from "@/lib/dal/admin";
import { routes } from "@/lib/routes";

const STATUS_VARIANT: Record<
  InvitationStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  active: "default",
  used: "secondary",
  expired: "outline",
  revoked: "destructive",
};

export function InvitationList({ invitations }: { invitations: AdminInvitation[] }) {
  const t = useTranslations();
  const router = useRouter();
  const [target, setTarget] = useState<AdminInvitation | null>(null);
  const [isPending, startTransition] = useTransition();

  function confirmRevoke() {
    if (!target) {
      return;
    }

    startTransition(async () => {
      const result = await revokeInvitationAction(target.id);

      if (!result.ok) {
        toast.error(t(result.code));
        return;
      }

      toast.success(t("dashboard.invites.revokeSuccess"));
      setTarget(null);
      router.refresh();
    });
  }

  if (invitations.length === 0) {
    return (
      <p className="text-sm text-pretty text-muted-foreground">
        {t("dashboard.admin.invites.empty")}
      </p>
    );
  }

  return (
    <>
      <ul className="divide-y divide-border/60 overflow-hidden rounded-lg border border-border/60">
        {invitations.map((invitation) => (
          <li
            key={invitation.id}
            className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex min-w-0 items-center gap-2">
                <p className="truncate text-sm font-medium">
                  {invitation.email ?? t("dashboard.invites.unbound")}
                </p>
                <Badge variant={STATUS_VARIANT[invitation.status]} className="shrink-0">
                  {t(`dashboard.invites.status.${invitation.status}`)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground tabular-nums" suppressHydrationWarning>
                {formatDate(invitation.createdAt)}
                {" · "}
                {t("dashboard.invites.usage", {
                  current: invitation.useCount,
                  max: invitation.maxUses,
                })}
                {" · "}
                {invitation.expiresAt
                  ? t("dashboard.invites.expires", { date: formatDate(invitation.expiresAt) })
                  : t("dashboard.invites.noExpiry")}
              </p>
              {invitation.redeemedBy.map((redemption) => (
                <p key={redemption.userId} className="text-xs text-muted-foreground">
                  <Link
                    href={routes.adminUser(redemption.userId)}
                    className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                  >
                    {t("dashboard.admin.invites.redeemedBy", {
                      name: redemption.name?.trim() || redemption.email || "—",
                    })}
                  </Link>
                  {" · "}
                  {formatDate(redemption.redeemedAt)}
                </p>
              ))}
            </div>

            {invitation.status === "active" ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-fit shrink-0 text-destructive hover:text-destructive"
                onClick={() => setTarget(invitation)}
              >
                {t("dashboard.invites.revoke")}
              </Button>
            ) : null}
          </li>
        ))}
      </ul>

      <Dialog open={target !== null} onOpenChange={(open) => (open ? null : setTarget(null))}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("dashboard.invites.revoke")}</DialogTitle>
            <DialogDescription>{t("dashboard.invites.revokeConfirm")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => setTarget(null)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={confirmRevoke}
            >
              {isPending ? t("dashboard.invites.revoking") : t("dashboard.invites.revoke")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
