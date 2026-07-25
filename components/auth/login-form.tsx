"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

import { loginAction } from "@/app/(auth)/actions";
import { FormField } from "@/components/auth/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";
import { routes } from "@/lib/routes";

export function LoginForm({ next }: { next?: string }) {
  const t = useTranslations();
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    loginAction,
    null,
  );

  const failed = state && !state.ok ? state : null;

  return (
    <form action={formAction} className="grid gap-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

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

      <FormField
        label={t("auth.fields.password")}
        name="password"
        type="password"
        autoComplete="current-password"
        required
        labelAction={
          <Link
            href={routes.forgotPassword}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("auth.login.forgotPassword")}
          </Link>
        }
        error={failed?.fieldErrors?.password ? t(failed.fieldErrors.password) : undefined}
      />

      <Button type="submit" className="h-10 w-full" disabled={isPending}>
        {isPending ? t("common.loading") : t("auth.login.submit")}
      </Button>
    </form>
  );
}
