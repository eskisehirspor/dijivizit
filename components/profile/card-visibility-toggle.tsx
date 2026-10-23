"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { setBankAccountVisibilityAction } from "@/app/actions/bank-account";
import { setBillingInfoVisibilityAction } from "@/app/actions/billing-info";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ACTIONS = {
  bank: setBankAccountVisibilityAction,
  billing: setBillingInfoVisibilityAction,
} as const;

/** "Show on my card" switch for details that stay on file either way. */
export function CardVisibilityToggle({
  kind,
  visible,
}: {
  kind: keyof typeof ACTIONS;
  visible: boolean;
}) {
  const t = useTranslations("profile.cardVisibility");
  const [checked, setChecked] = useState(visible);
  const [isPending, startTransition] = useTransition();
  const id = `card-visibility-${kind}`;

  function handleChange(next: boolean) {
    setChecked(next);
    startTransition(async () => {
      const result = await ACTIONS[kind](next);
      if (!result.ok) {
        setChecked(!next);
        toast.error(t("failed"));
        return;
      }
      toast.success(next ? t("shown") : t("hidden"));
    });
  }

  return (
    <div className="flex items-start justify-between gap-6 rounded-lg border border-border/60 p-6">
      <div className="flex flex-col gap-1">
        <Label htmlFor={id} className="text-sm font-medium">
          {t("label")}
        </Label>
        <p className="text-xs text-pretty text-muted-foreground">
          {checked ? t("onHint") : t("offHint")}
        </p>
      </div>
      <Switch id={id} checked={checked} disabled={isPending} onCheckedChange={handleChange} />
    </div>
  );
}
