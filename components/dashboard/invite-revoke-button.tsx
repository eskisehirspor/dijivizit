"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { revokeInvitationAction } from "@/app/actions/invitations";
import { Button } from "@/components/ui/button";

export function InviteRevokeButton({
  invitationId,
}: {
  invitationId: string;
}) {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();

  function handleRevoke() {
    const confirmed = window.confirm(
      t("dashboard.invites.revokeConfirm"),
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = await revokeInvitationAction(invitationId);

      if (!result.ok) {
        toast.error(t(result.code));
        return;
      }

      toast.success(t("dashboard.invites.revokeSuccess"));
      window.location.reload();
    });
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      onClick={handleRevoke}
      disabled={isPending}
    >
      {isPending
        ? t("dashboard.invites.revoking")
        : t("dashboard.invites.revoke")}
    </Button>
  );
}