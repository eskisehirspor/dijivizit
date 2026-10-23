"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { changeEmailAction } from "@/app/actions/account";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

export function EmailForm() {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    changeEmailAction,
    null,
  );

  const failed = state && !state.ok ? state : null;

  useEffect(() => {
    if (state?.ok) {
      toast.success(t("settings.email.sent"));
      formRef.current?.reset();
    } else if (state && !state.ok && !state.fieldErrors) {
      toast.error(t(state.code));
    }
  }, [state, t]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-5">
      <FormField
        label={t("settings.email.label")}
        name="email"
        type="email"
        autoComplete="email"
        required
        error={failed?.fieldErrors?.email ? t(failed.fieldErrors.email) : undefined}
      />
      <Button type="submit" variant="outline" className="h-10 w-fit" disabled={isPending}>
        {isPending ? t("common.loading") : t("settings.email.submit")}
      </Button>
    </form>
  );
}
