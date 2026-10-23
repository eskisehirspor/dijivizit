"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { createProfileLinkAction } from "@/app/actions/profile-links";
import { LinkValueField } from "@/components/profile/link-value-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LinkLabelField } from "@/components/profile/link-label-field";
import { Label } from "@/components/ui/label";
import type { ActionResult } from "@/lib/action-result";
import {
  MVP_LINK_PLATFORMS,
  PROFILE_LINK_LIMIT,
  type MvpLinkPlatform,
} from "@/lib/profile/platforms";
import { cn } from "@/lib/utils";

export function LinkForm({ linkCount }: { linkCount: number }) {
  const t = useTranslations();
  const [platform, setPlatform] = useState<MvpLinkPlatform>("website");
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    createProfileLinkAction,
    null,
  );
  const [acknowledgedSuccess, setAcknowledgedSuccess] = useState<ActionResult | null>(null);
  const [formKey, setFormKey] = useState(0);

  if (state?.ok && state !== acknowledgedSuccess) {
    setAcknowledgedSuccess(state);
    setFormKey((key) => key + 1);
    setPlatform("website");
  }

  useEffect(() => {
    if (!acknowledgedSuccess?.ok) {
      return;
    }
    toast.success(t("profile.links.created"));
  }, [acknowledgedSuccess, t]);

  const failed = state && !state.ok ? state : null;
  const atLimit = linkCount >= PROFILE_LINK_LIMIT;

  return (
    <form
      key={formKey}
      action={formAction}
      className="grid gap-5 rounded-lg border border-border/60 p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">{t("profile.links.addTitle")}</h2>
        <p className="text-xs text-muted-foreground">{t("profile.links.addSubtitle")}</p>
      </div>

      {failed && !failed.fieldErrors ? (
        <Alert variant="destructive">
          <AlertDescription>{t(failed.code)}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="platform" className="text-xs font-medium text-muted-foreground">
          {t("profile.links.fields.platform")}
        </Label>
        <select
          id="platform"
          name="platform"
          value={platform}
          disabled={atLimit || isPending}
          onChange={(event) => setPlatform(event.target.value as MvpLinkPlatform)}
          className={cn(
            "h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {MVP_LINK_PLATFORMS.map((item) => (
            <option key={item} value={item}>
              {t(`profile.links.platforms.${item}`)}
            </option>
          ))}
        </select>
      </div>

      <LinkValueField
        key={`${formKey}-${platform}`}
        platform={platform}
        required
        disabled={atLimit || isPending}
        error={failed?.fieldErrors?.value ? t(failed.fieldErrors.value) : undefined}
      />

      <LinkLabelField
        id="link-label-new"
        disabled={atLimit || isPending}
        error={failed?.fieldErrors?.label ? t(failed.fieldErrors.label) : undefined}
      />

      <Button type="submit" className="h-10 w-fit" disabled={atLimit || isPending}>
        {isPending ? t("common.loading") : t("profile.links.add")}
      </Button>
    </form>
  );
}
