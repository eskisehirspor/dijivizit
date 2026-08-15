"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

import { createInvitationAction, type CreateInvitationData } from "@/app/actions/invitations";
import { CopyUrlButton } from "@/components/dashboard/copy-url-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionResult } from "@/lib/action-result";

export function InviteCreateForm() {
  const t = useTranslations();
  const [isUnlimited, setIsUnlimited] = useState(false);

  const [state, formAction, isPending] = useActionState<
    ActionResult<CreateInvitationData> | null,
    FormData
  >(createInvitationAction, null);

  const failed = state && !state.ok ? state : null;
  const created = state?.ok ? state.data.plaintext : null;

  return (
    <form action={formAction} className="grid gap-5">
      {failed && !failed.fieldErrors ? (
        <Alert variant="destructive">
          <AlertDescription>{t(failed.code)}</AlertDescription>
        </Alert>
      ) : null}

      {created ? (
        <div className="grid gap-2 rounded-lg border border-border/60 p-4">
          <p className="text-sm font-medium">{t("dashboard.invites.createdTitle")}</p>
          <p className="text-xs text-pretty text-muted-foreground">
            {t("dashboard.invites.createdBody")}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-sm tracking-wide">{created}</p>
            <CopyUrlButton url={created} label={t("common.copy")} />
          </div>
        </div>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="invite-email" className="text-xs font-medium text-muted-foreground">
          {t("dashboard.invites.fields.email")}
        </Label>

        <Input
          id="invite-email"
          name="email"
          type="email"
          className="h-10"
          placeholder={t("dashboard.invites.fields.emailPlaceholder")}
          aria-invalid={Boolean(failed?.fieldErrors?.email)}
        />

        <p className="text-xs text-muted-foreground">
          {t("dashboard.invites.fields.emailHint")}
        </p>

        {failed?.fieldErrors?.email ? (
          <p className="text-xs text-destructive">
            {t(failed.fieldErrors.email)}
          </p>
        ) : null}
      </div>

      {/* Her davet kodu yalnızca 1 kez kullanılabilir. */}
      <input type="hidden" name="maxUses" value="1" />

      <div className="grid gap-2">
        <Label htmlFor="invite-expires" className="text-xs font-medium text-muted-foreground">
          {t("dashboard.invites.fields.expiresAt")}
        </Label>

        <Input
          id="invite-expires"
          name="expiresAt"
          type="datetime-local"
          className="h-10"
          disabled={isUnlimited}
          aria-invalid={Boolean(failed?.fieldErrors?.expiresAt)}
        />

        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isUnlimited}
            onChange={(event) => setIsUnlimited(event.target.checked)}
            className="size-4"
          />
          <span>Süresiz</span>
        </label>

        <p className="text-xs text-muted-foreground">
          Süresiz seçilirse davetin son kullanım tarihi olmaz.
        </p>

        {failed?.fieldErrors?.expiresAt ? (
          <p className="text-xs text-destructive">
            {t(failed.fieldErrors.expiresAt)}
          </p>
        ) : null}
      </div>

      <Button type="submit" className="h-10 w-fit" disabled={isPending}>
        {isPending ? t("common.loading") : t("dashboard.invites.submit")}
      </Button>
    </form>
  );
}