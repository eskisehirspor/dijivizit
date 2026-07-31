"use client";

import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";

import { changeVerificationEmailAction, resendVerificationAction } from "@/app/(auth)/actions";
import { FormField } from "@/components/auth/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const RESEND_COOLDOWN_SECONDS = 60;

function cooldownStorageKey(email: string) {
  return `dijivizit_verify_resend_at:${email.toLowerCase()}`;
}

function remainingCooldownSeconds(email: string, now: number): number {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const raw = window.localStorage.getItem(cooldownStorageKey(email));
    if (!raw) {
      return 0;
    }

    const sentAt = Number(raw);
    if (!Number.isFinite(sentAt)) {
      return 0;
    }

    const elapsed = Math.floor((now - sentAt) / 1000);
    return Math.max(0, RESEND_COOLDOWN_SECONDS - elapsed);
  } catch {
    return 0;
  }
}

export function VerifyEmailPanel({ email }: { email: string | null }) {
  const t = useTranslations();
  const [now, setNow] = useState(() => Date.now());
  const [showChangeEmail, setShowChangeEmail] = useState(false);

  const [resendState, resendAction, resendPending] = useActionState<ActionResult | null, FormData>(
    resendVerificationAction,
    null,
  );

  const [changeState, changeAction, changePending] = useActionState<ActionResult | null, FormData>(
    changeVerificationEmailAction,
    null,
  );

  const cooldown = email ? remainingCooldownSeconds(email, now) : 0;
  const resendFailed = resendState && !resendState.ok ? resendState : null;
  const changeFailed = changeState && !changeState.ok ? changeState : null;

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-5 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <MailCheck aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            {t("auth.verify.title")}
          </h1>
          <p className="text-sm text-pretty text-muted-foreground">{t("auth.verify.subtitle")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-5 text-center">
        <p className="text-sm font-medium">{t("auth.verify.sentTitle")}</p>
        <p className="text-sm text-pretty text-muted-foreground">{t("auth.verify.sentBody")}</p>
        {email ? <p className="pt-1 font-mono text-sm break-all text-foreground">{email}</p> : null}
      </div>

      {resendState?.ok ? (
        <Alert>
          <AlertDescription>{t("auth.verify.resendSuccess")}</AlertDescription>
        </Alert>
      ) : null}

      {resendFailed ? (
        <Alert variant="destructive">
          <AlertDescription>{t(resendFailed.code)}</AlertDescription>
        </Alert>
      ) : null}

      {changeFailed ? (
        <Alert variant="destructive">
          <AlertDescription>{t(changeFailed.code)}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-3">
        {email ? (
          <form
            action={resendAction}
            onSubmit={() => {
              // Start the cooldown immediately so rapid clicks cannot spam resend
              // before the server responds.
              try {
                window.localStorage.setItem(cooldownStorageKey(email), String(Date.now()));
              } catch {
                // ignore
              }
              setNow(Date.now());
            }}
          >
            <input type="hidden" name="email" value={email} />
            <Button type="submit" className="h-10 w-full" disabled={resendPending || cooldown > 0}>
              {resendPending
                ? t("common.loading")
                : cooldown > 0
                  ? t("auth.verify.resendCooldown", { seconds: cooldown })
                  : t("auth.verify.resend")}
            </Button>
          </form>
        ) : (
          <p className="text-center text-sm text-pretty text-muted-foreground">
            {t("auth.verify.missingEmail")}
          </p>
        )}

        <Button asChild variant="outline" className="h-10 w-full">
          <Link href={routes.login}>{t("auth.verify.backToLogin")}</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 border-t border-border/60 pt-6">
        <button
          type="button"
          onClick={() => setShowChangeEmail((open) => !open)}
          className={cn(
            "text-sm text-muted-foreground transition-colors hover:text-foreground",
            "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
          )}
          aria-expanded={showChangeEmail}
        >
          {t("auth.verify.changeEmailToggle")}
        </button>

        {showChangeEmail ? (
          <form action={changeAction} className="grid gap-4">
            <FormField
              label={t("auth.fields.email")}
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t("auth.fields.emailPlaceholder")}
              defaultValue={email ?? undefined}
              required
              error={
                changeFailed?.fieldErrors?.email ? t(changeFailed.fieldErrors.email) : undefined
              }
            />
            <Button
              type="submit"
              variant="secondary"
              className="h-10 w-full"
              disabled={changePending}
            >
              {changePending ? t("common.loading") : t("auth.verify.changeEmailSubmit")}
            </Button>
            <p className="text-xs text-pretty text-muted-foreground">
              {t("auth.verify.changeEmailHint")}{" "}
              <Link
                href={routes.register}
                className="text-foreground underline-offset-4 transition-colors hover:underline"
              >
                {t("auth.verify.registerLink")}
              </Link>
            </p>
          </form>
        ) : null}
      </div>
    </div>
  );
}
