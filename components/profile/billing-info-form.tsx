"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { deleteBillingInfoAction, upsertBillingInfoAction } from "@/app/actions/billing-info";
import { FormField } from "@/components/auth/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/action-result";
import { normalizeTaxNumber } from "@/lib/validations/billing-info";
import { routes } from "@/lib/routes";

export type BillingInfoDefaults = {
  companyTitle: string;
  companyAddress: string;
  taxNumber: string;
  taxOffice: string;
};

export function BillingInfoForm({
  defaults,
  hasExisting,
}: {
  defaults: BillingInfoDefaults;
  hasExisting: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    upsertBillingInfoAction,
    null,
  );
  const [baseline, setBaseline] = useState(defaults);
  const [values, setValues] = useState(defaults);
  const [acknowledgedSuccess, setAcknowledgedSuccess] = useState<ActionResult | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (state?.ok && state !== acknowledgedSuccess) {
    setAcknowledgedSuccess(state);
  }

  useEffect(() => {
    if (!acknowledgedSuccess?.ok) {
      return;
    }
    toast.success(t("profile.billing.saved"));
    router.push(routes.dashboard);
  }, [acknowledgedSuccess, router, t]);

  const isDirty = useMemo(
    () =>
      values.companyTitle !== baseline.companyTitle ||
      values.companyAddress !== baseline.companyAddress ||
      normalizeTaxNumber(values.taxNumber) !== normalizeTaxNumber(baseline.taxNumber) ||
      values.taxOffice !== baseline.taxOffice,
    [baseline, values],
  );

  const failed = state && !state.ok ? state : null;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const result = await deleteBillingInfoAction();
      if (!result.ok) {
        toast.error(t(result.code));
        return;
      }
      const empty = { companyTitle: "", companyAddress: "", taxNumber: "", taxOffice: "" };
      setValues(empty);
      setBaseline(empty);
      toast.success(t("profile.billing.deleted"));
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <form action={formAction} className="grid gap-6">
      {failed && !failed.fieldErrors ? (
        <Alert variant="destructive">
          <AlertDescription>{t(failed.code)}</AlertDescription>
        </Alert>
      ) : null}

      <FormField
        label={t("profile.billing.fields.companyTitle")}
        name="companyTitle"
        autoComplete="organization"
        required
        value={values.companyTitle}
        onChange={(event) =>
          setValues((current) => ({ ...current, companyTitle: event.target.value }))
        }
        error={failed?.fieldErrors?.companyTitle ? t(failed.fieldErrors.companyTitle) : undefined}
      />

      <div className="grid gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <Label htmlFor="companyAddress" className="text-xs font-medium text-muted-foreground">
            {t("profile.billing.fields.companyAddress")}
          </Label>
          <span className="text-xs text-muted-foreground">
            {t("profile.fields.addressCount", {
              current: values.companyAddress.length,
              max: 500,
            })}
          </span>
        </div>
        <Textarea
          id="companyAddress"
          name="companyAddress"
          required
          rows={4}
          maxLength={500}
          value={values.companyAddress}
          onChange={(event) =>
            setValues((current) => ({ ...current, companyAddress: event.target.value }))
          }
          aria-invalid={failed?.fieldErrors?.companyAddress ? true : undefined}
          className="min-h-24 resize-y"
        />
        {failed?.fieldErrors?.companyAddress ? (
          <p className="text-sm text-destructive">{t(failed.fieldErrors.companyAddress)}</p>
        ) : null}
      </div>

      <FormField
        label={t("profile.billing.fields.taxNumber")}
        name="taxNumber"
        autoComplete="off"
        inputMode="numeric"
        required
        spellCheck={false}
        value={values.taxNumber}
        onChange={(event) =>
          setValues((current) => ({ ...current, taxNumber: event.target.value }))
        }
        error={failed?.fieldErrors?.taxNumber ? t(failed.fieldErrors.taxNumber) : undefined}
        className="font-mono"
      />

      <FormField
        label={t("profile.billing.fields.taxOffice")}
        name="taxOffice"
        autoComplete="off"
        required
        value={values.taxOffice}
        onChange={(event) =>
          setValues((current) => ({ ...current, taxOffice: event.target.value }))
        }
        error={failed?.fieldErrors?.taxOffice ? t(failed.fieldErrors.taxOffice) : undefined}
      />

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <Button type="submit" className="h-10" disabled={isPending || !isDirty}>
          {isPending ? t("common.loading") : t("common.save")}
        </Button>
        {hasExisting ? (
          <Button
            type="button"
            variant="ghost"
            className="h-10 text-destructive hover:text-destructive"
            disabled={isPending || isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? t("common.loading") : t("profile.billing.delete")}
          </Button>
        ) : null}
      </div>
    </form>
  );
}
