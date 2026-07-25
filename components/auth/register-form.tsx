"use client";

import { MailCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

import { registerAction } from "@/app/(auth)/actions";
import { FormField } from "@/components/auth/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

export function RegisterForm() {
  const t = useTranslations();
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    registerAction,
    null,
  );

  if (state?.ok) {
    return (
      <Alert>
        <MailCheck />
        <AlertTitle>{t("auth.register.checkEmailTitle")}</AlertTitle>
        <AlertDescription>{t("auth.register.checkEmailBody")}</AlertDescription>
      </Alert>
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
        label={t("auth.fields.fullName")}
        name="fullName"
        autoComplete="name"
        placeholder={t("auth.fields.fullNamePlaceholder")}
        required
        error={failed?.fieldErrors?.fullName ? t(failed.fieldErrors.fullName) : undefined}
      />

      <FormField
        label={t("auth.fields.email")}
        name="email"
        type="email"
        autoComplete="email"
        placeholder={t("auth.fields.emailPlaceholder")}
        required
        error={failed?.fieldErrors?.email ? t(failed.fieldErrors.email) : undefined}
      />

      <FormField
        label={t("auth.fields.password")}
        name="password"
        type="password"
        autoComplete="new-password"
        required
        error={failed?.fieldErrors?.password ? t(failed.fieldErrors.password) : undefined}
      />

      <Button type="submit" className="h-10 w-full" disabled={isPending}>
        {isPending ? t("common.loading") : t("auth.register.submit")}
      </Button>
    </form>
  );
}
