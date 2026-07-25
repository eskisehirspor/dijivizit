"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { createProfileSkillAction } from "@/app/actions/profile-skills";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionResult } from "@/lib/action-result";
import {
  PROFILE_SKILL_LIMIT,
  PROFILE_SKILL_TYPES,
  type ProfileSkillType,
} from "@/lib/profile/skill-types";
import { cn } from "@/lib/utils";

export function SkillForm({ skillCount }: { skillCount: number }) {
  const t = useTranslations();
  const [type, setType] = useState<ProfileSkillType>("expertise");
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    createProfileSkillAction,
    null,
  );
  const [acknowledgedSuccess, setAcknowledgedSuccess] = useState<ActionResult | null>(null);
  const [formKey, setFormKey] = useState(0);

  if (state?.ok && state !== acknowledgedSuccess) {
    setAcknowledgedSuccess(state);
    setFormKey((key) => key + 1);
    setType("expertise");
  }

  useEffect(() => {
    if (!acknowledgedSuccess?.ok) {
      return;
    }
    toast.success(t("profile.skills.created"));
  }, [acknowledgedSuccess, t]);

  const failed = state && !state.ok ? state : null;
  const atLimit = skillCount >= PROFILE_SKILL_LIMIT;

  return (
    <form
      key={formKey}
      action={formAction}
      className="grid gap-5 rounded-lg border border-border/60 p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">{t("profile.skills.addTitle")}</h2>
        <p className="text-xs text-muted-foreground">{t("profile.skills.addSubtitle")}</p>
      </div>

      {failed && !failed.fieldErrors ? (
        <Alert variant="destructive">
          <AlertDescription>{t(failed.code)}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="skill-type" className="text-xs font-medium text-muted-foreground">
          {t("profile.skills.fields.type")}
        </Label>
        <select
          id="skill-type"
          name="type"
          value={type}
          disabled={atLimit || isPending}
          onChange={(event) => setType(event.target.value as ProfileSkillType)}
          className={cn(
            "h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {PROFILE_SKILL_TYPES.map((item) => (
            <option key={item} value={item}>
              {t(`profile.skills.types.${item}`)}
            </option>
          ))}
        </select>
        {failed?.fieldErrors?.type ? (
          <p className="text-xs text-destructive">{t(failed.fieldErrors.type)}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="skill-name" className="text-xs font-medium text-muted-foreground">
          {t("profile.skills.fields.name")}
        </Label>
        <Input
          id="skill-name"
          name="name"
          required
          maxLength={60}
          disabled={atLimit || isPending}
          placeholder={t("profile.skills.placeholders.name")}
          aria-invalid={failed?.fieldErrors?.name ? true : undefined}
        />
        {failed?.fieldErrors?.name ? (
          <p className="text-xs text-destructive">{t(failed.fieldErrors.name)}</p>
        ) : null}
      </div>

      <Button type="submit" className="h-10 w-fit" disabled={atLimit || isPending}>
        {isPending ? t("common.loading") : t("profile.skills.add")}
      </Button>
    </form>
  );
}
