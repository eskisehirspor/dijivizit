"use client";

import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

import { forgotPasswordAction } from "@/app/(auth)/actions";
import { FormField } from "@/components/auth/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";
import { routes } from "@/lib/routes";

export function ForgotPasswordForm() {
  const t = useTranslations();
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    forgotPasswordAction,
    null,
  );

  if (state?.ok) {
    return (
      <div className="flex flex-col gap-6">
        <Alert>
          <MailCheck />
          <AlertTitle>{t("auth.forgotPassword.sentTitle")}</AlertTitle>
          <AlertDescription>{t("auth.forgotPassword.sentBody")}</AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="h-10 w-full">
          <Link href={routes.login}>{t("auth.forgotPassword.backToLogin")}</Link>
        </Button>
      </div>
    );
  }

  const failed = state && !state.ok ? state : null;

  return (
    <form action={formAction} className="grid gap-5">
      {failed && !failed.fieldErrors ? (
        <Alert variant="destructive">
          <AlertDescription>{t(failed.code)}</AlertDescription>
        </Alert>
      ) : null}

      <FormField
        label={t("auth.fields.email")}
        name="email"
        type="email"
        autoComplete="email"
        placeholder={t("auth.fields.emailPlaceholder")}
        required
        error={failed?.fieldErrors?.email ? t(failed.fieldErrors.email) : undefined}
      />

      <Button type="submit" className="h-10 w-full" disabled={isPending}>
        {isPending ? t("common.loading") : t("auth.forgotPassword.submit")}
      </Button>
    </form>
  );
}
