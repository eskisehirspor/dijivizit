"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { deleteBankAccountAction, upsertBankAccountAction } from "@/app/actions/bank-account";
import { FormField } from "@/components/auth/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ActionResult } from "@/lib/action-result";
import { detectTurkishBankName, normalizeIban, turkishBankNames } from "@/lib/bank/turkish-iban";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export type BankAccountDefaults = {
  accountHolder: string;
  iban: string;
  bankName: string;
};

export function BankAccountForm({
  defaults,
  hasExisting,
}: {
  defaults: BankAccountDefaults;
  hasExisting: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();
  const banks = useMemo(() => turkishBankNames(), []);
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    upsertBankAccountAction,
    null,
  );
  const [baseline, setBaseline] = useState(defaults);
  const [values, setValues] = useState(defaults);
  const [acknowledgedSuccess, setAcknowledgedSuccess] = useState<ActionResult | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const detectedBank = useMemo(() => detectTurkishBankName(values.iban), [values.iban]);

  if (state?.ok && state !== acknowledgedSuccess) {
    setAcknowledgedSuccess(state);
  }

  useEffect(() => {
    if (!acknowledgedSuccess?.ok) {
      return;
    }
    toast.success(t("profile.bank.saved"));
    router.push(routes.dashboard);
  }, [acknowledgedSuccess, router, t]);

  const isDirty = useMemo(
    () =>
      values.accountHolder !== baseline.accountHolder ||
      normalizeIban(values.iban) !== normalizeIban(baseline.iban) ||
      (detectedBank ?? values.bankName) !== baseline.bankName,
    [baseline, detectedBank, values],
  );

  const failed = state && !state.ok ? state : null;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const result = await deleteBankAccountAction();
      if (!result.ok) {
        toast.error(t(result.code));
        return;
      }
      setValues({ accountHolder: "", iban: "", bankName: "" });
      setBaseline({ accountHolder: "", iban: "", bankName: "" });
      toast.success(t("profile.bank.deleted"));
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
        label={t("profile.bank.fields.accountHolder")}
        name="accountHolder"
        autoComplete="name"
        required
        value={values.accountHolder}
        onChange={(event) =>
          setValues((current) => ({ ...current, accountHolder: event.target.value }))
        }
        error={failed?.fieldErrors?.accountHolder ? t(failed.fieldErrors.accountHolder) : undefined}
      />

      <FormField
        label={t("profile.bank.fields.iban")}
        name="iban"
        autoComplete="off"
        required
        spellCheck={false}
        value={values.iban}
        onChange={(event) => setValues((current) => ({ ...current, iban: event.target.value }))}
        error={failed?.fieldErrors?.iban ? t(failed.fieldErrors.iban) : undefined}
        className="font-mono uppercase"
      />

      <div className="grid gap-2">
        <Label htmlFor="bankName" className="text-xs font-medium text-muted-foreground">
          {t("profile.bank.fields.bankName")}
        </Label>
        {detectedBank ? (
          <>
            <input type="hidden" name="bankName" value={detectedBank} />
            <p className="rounded-lg border border-border/60 px-3 py-2.5 text-sm">{detectedBank}</p>
            <p className="text-xs text-muted-foreground">{t("profile.bank.detectedHint")}</p>
          </>
        ) : (
          <>
            <select
              id="bankName"
              name="bankName"
              value={values.bankName}
              onChange={(event) =>
                setValues((current) => ({ ...current, bankName: event.target.value }))
              }
              aria-invalid={failed?.fieldErrors?.bankName ? true : undefined}
              className={cn(
                "h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              )}
            >
              <option value="">{t("profile.bank.fields.bankNamePlaceholder")}</option>
              {banks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            {failed?.fieldErrors?.bankName ? (
              <p className="text-sm text-destructive">{t(failed.fieldErrors.bankName)}</p>
            ) : (
              <p className="text-xs text-muted-foreground">{t("profile.bank.manualHint")}</p>
            )}
          </>
        )}
      </div>

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
            {isDeleting ? t("common.loading") : t("profile.bank.delete")}
          </Button>
        ) : null}
      </div>
    </form>
  );
}
