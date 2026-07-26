"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { updateBasicProfileAction } from "@/app/actions/profile";
import { FormField } from "@/components/auth/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/action-result";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ABOUT_MAX_LENGTH, ADDRESS_MAX_LENGTH } from "@/lib/validations/profile";

export type BasicInfoDefaults = {
  fullName: string;
  title: string;
  company: string;
  about: string;
  address: string;
};

export function BasicInfoForm({ defaults }: { defaults: BasicInfoDefaults }) {
  const t = useTranslations();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    updateBasicProfileAction,
    null,
  );

  const [baseline] = useState(defaults);
  const [values, setValues] = useState(defaults);
  const [acknowledgedSuccess, setAcknowledgedSuccess] = useState<ActionResult | null>(null);

  if (state?.ok && state !== acknowledgedSuccess) {
    setAcknowledgedSuccess(state);
  }

  useEffect(() => {
    if (!acknowledgedSuccess?.ok) {
      return;
    }

    toast.success(t("profile.edit.saved"));
    router.push(routes.dashboard);
  }, [acknowledgedSuccess, router, t]);

  const isDirty = useMemo(
    () =>
      values.fullName !== baseline.fullName ||
      values.title !== baseline.title ||
      values.company !== baseline.company ||
      values.about !== baseline.about ||
      values.address !== baseline.address,
    [baseline, values],
  );

  const failed = state && !state.ok ? state : null;
  const aboutLength = values.about.length;
  const addressLength = values.address.length;

  return (
    <form action={formAction} className="grid gap-6">
      {failed && !failed.fieldErrors ? (
        <Alert variant="destructive">
          <AlertDescription>{t(failed.code)}</AlertDescription>
        </Alert>
      ) : null}

      <FormField
        label={t("profile.fields.fullName")}
        name="fullName"
        autoComplete="name"
        required
        value={values.fullName}
        onChange={(event) => setValues((current) => ({ ...current, fullName: event.target.value }))}
        error={failed?.fieldErrors?.fullName ? t(failed.fieldErrors.fullName) : undefined}
      />

      <FormField
        label={t("profile.fields.title")}
        name="title"
        autoComplete="organization-title"
        value={values.title}
        onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
        error={failed?.fieldErrors?.title ? t(failed.fieldErrors.title) : undefined}
      />

      <FormField
        label={t("profile.fields.company")}
        name="company"
        autoComplete="organization"
        value={values.company}
        onChange={(event) => setValues((current) => ({ ...current, company: event.target.value }))}
        error={failed?.fieldErrors?.company ? t(failed.fieldErrors.company) : undefined}
      />

      <div className="grid gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <Label htmlFor="address" className="text-xs font-medium text-muted-foreground">
            {t("profile.fields.address")}
          </Label>
          <span
            className={cn(
              "text-xs text-muted-foreground tabular-nums",
              addressLength > ADDRESS_MAX_LENGTH && "text-destructive",
            )}
          >
            {t("profile.fields.addressCount", {
              current: addressLength,
              max: ADDRESS_MAX_LENGTH,
            })}
          </span>
        </div>
        <Textarea
          id="address"
          name="address"
          rows={3}
          autoComplete="street-address"
          value={values.address}
          onChange={(event) =>
            setValues((current) => ({ ...current, address: event.target.value }))
          }
          aria-invalid={failed?.fieldErrors?.address ? true : undefined}
          aria-describedby={failed?.fieldErrors?.address ? "address-error" : undefined}
          className="min-h-24"
          placeholder={t("profile.fields.addressPlaceholder")}
        />
        {failed?.fieldErrors?.address ? (
          <p id="address-error" className="text-sm text-destructive">
            {t(failed.fieldErrors.address)}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <Label htmlFor="about" className="text-xs font-medium text-muted-foreground">
            {t("profile.fields.about")}
          </Label>
          <span
            className={cn(
              "text-xs text-muted-foreground tabular-nums",
              aboutLength > ABOUT_MAX_LENGTH && "text-destructive",
            )}
          >
            {t("profile.fields.aboutCount", {
              current: aboutLength,
              max: ABOUT_MAX_LENGTH,
            })}
          </span>
        </div>
        <Textarea
          id="about"
          name="about"
          rows={6}
          value={values.about}
          onChange={(event) => setValues((current) => ({ ...current, about: event.target.value }))}
          aria-invalid={failed?.fieldErrors?.about ? true : undefined}
          aria-describedby={failed?.fieldErrors?.about ? "about-error" : undefined}
          className="min-h-32"
        />
        {failed?.fieldErrors?.about ? (
          <p id="about-error" className="text-sm text-destructive">
            {t(failed.fieldErrors.about)}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-6 pt-2">
        <Button type="submit" className="h-10" disabled={isPending || !isDirty}>
          {isPending ? t("common.loading") : t("common.save")}
        </Button>
        <Link
          href={routes.dashboard}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("common.back")}
        </Link>
      </div>
    </form>
  );
}
