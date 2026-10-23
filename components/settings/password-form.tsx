"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { changePasswordAction } from "@/app/actions/account";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    changePasswordAction,
    null,
  );

  const failed = state && !state.ok ? state : null;
  const fieldError = (name: string) =>
    failed?.fieldErrors?.[name] ? t(failed.fieldErrors[name]) : undefined;

  useEffect(() => {
    if (state?.ok) {
      toast.success(t("settings.password.updated"));
      formRef.current?.reset();
    } else if (state && !state.ok && !state.fieldErrors) {
      toast.error(t(state.code));
    }
  }, [state, t]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-5">
      {hasPassword ? (
        <FormField
          label={t("settings.password.current")}
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          error={fieldError("currentPassword")}
        />
      ) : null}
      <FormField
        label={t("settings.password.new")}
        name="newPassword"
        type="password"
        autoComplete="new-password"
        required
        error={fieldError("newPassword")}
      />
      <FormField
        label={t("settings.password.confirm")}
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        error={fieldError("confirmPassword")}
      />
      <Button type="submit" variant="outline" className="h-10 w-fit" disabled={isPending}>
        {isPending ? t("common.loading") : t("settings.password.submit")}
      </Button>
    </form>
  );
}
