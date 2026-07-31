"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";

import { resetPasswordAction } from "@/app/(auth)/actions";
import { FormField } from "@/components/auth/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

export function ResetPasswordForm() {
  const t = useTranslations();
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    resetPasswordAction,
    null,
  );

  const failed = state && !state.ok ? state : null;

  return (
    <form action={formAction} className="grid gap-5">
      {failed && !failed.fieldErrors ? (
        <Alert variant="destructive">
          <AlertDescription>{t(failed.code)}</AlertDescription>
        </Alert>
      ) : null}

      <FormField
        label={t("auth.fields.newPassword")}
        name="password"
        type="password"
        autoComplete="new-password"
        required
        error={failed?.fieldErrors?.password ? t(failed.fieldErrors.password) : undefined}
      />

      <FormField
        label={t("auth.fields.confirmPassword")}
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        error={
          failed?.fieldErrors?.confirmPassword ? t(failed.fieldErrors.confirmPassword) : undefined
        }
      />

      <Button type="submit" className="h-10 w-full" disabled={isPending}>
        {isPending ? t("common.loading") : t("auth.resetPassword.submit")}
      </Button>
    </form>
  );
}
