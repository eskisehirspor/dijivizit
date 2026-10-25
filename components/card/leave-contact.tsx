"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";

import {
  type CardContactState,
  getCardContactTokenAction,
  submitCardContactAction,
} from "@/app/actions/card-contact";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { routes } from "@/lib/routes";

const INITIAL: CardContactState = { status: "idle" };

/** "Bilgilerimi bırak": the visitor's half of the exchange. */
export function LeaveContact({
  publicId,
  ownerName,
}: {
  publicId: string;
  ownerName: string | null;
}) {
  const t = useTranslations("card.leave");
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-12 w-full rounded-lg px-6 text-base"
        onClick={() => {
          setSession((n) => n + 1);
          setOpen(true);
        }}
      >
        {t("trigger")}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-md">
          {open ? (
            <LeaveContactForm
              key={session}
              publicId={publicId}
              ownerName={ownerName}
              onClose={() => setOpen(false)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function LeaveContactForm({
  publicId,
  ownerName,
  onClose,
}: {
  publicId: string;
  ownerName: string | null;
  onClose: () => void;
}) {
  const t = useTranslations("card.leave");
  const tRoot = useTranslations();
  const [token, setToken] = useState("");
  const [state, formAction, isPending] = useActionState(
    submitCardContactAction.bind(null, publicId),
    INITIAL,
  );

  useEffect(() => {
    let alive = true;
    getCardContactTokenAction().then((value) => {
      if (alive) setToken(value);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <CheckCircle2 aria-hidden="true" className="size-10 text-foreground" strokeWidth={1.5} />
        <DialogTitle>{t("successTitle")}</DialogTitle>
        <DialogDescription>{t("successBody")}</DialogDescription>
        <div className="flex w-full flex-col gap-2 pt-2">
          <Button asChild className="h-12 w-full">
            <a href={routes.publicVcard(publicId)}>{tRoot("card.saveContact")}</a>
          </Button>
          <Button type="button" variant="ghost" className="h-11 w-full" onClick={onClose}>
            {t("close")}
          </Button>
        </div>
      </div>
    );
  }

  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const err = (key: string) => (errors[key] ? tRoot(errors[key] as never) : null);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <DialogHeader>
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription>
          {ownerName ? t("description", { name: ownerName }) : t("descriptionNoName")}
        </DialogDescription>
      </DialogHeader>

      <input type="hidden" name="form_token" value={token} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id="lc-name" label={t("fullName")} error={err("fullName")}>
        <Input
          id="lc-name"
          name="fullName"
          autoComplete="name"
          required
          maxLength={120}
          className="h-11"
          aria-invalid={Boolean(errors.fullName) || undefined}
        />
      </Field>
      <Field id="lc-phone" label={t("phone")} error={err("phone")}>
        <Input
          id="lc-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={40}
          className="h-11"
          aria-invalid={Boolean(errors.phone) || undefined}
        />
      </Field>
      <Field id="lc-email" label={t("email")} error={err("email")}>
        <Input
          id="lc-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          className="h-11"
          aria-invalid={Boolean(errors.email) || undefined}
        />
      </Field>
      <p className="-mt-3 text-xs text-muted-foreground">{t("reachableHint")}</p>
      <Field id="lc-company" label={t("company")} error={err("company")}>
        <Input
          id="lc-company"
          name="company"
          autoComplete="organization"
          maxLength={120}
          className="h-11"
        />
      </Field>
      <Field id="lc-message" label={t("message")} error={err("message")}>
        <Textarea
          id="lc-message"
          name="message"
          maxLength={1000}
          rows={3}
          placeholder={t("messagePlaceholder")}
        />
      </Field>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 size-4 shrink-0 accent-foreground"
          aria-invalid={Boolean(errors.consent) || undefined}
        />
        <span>
          {t.rich("consent", {
            link: (chunks) => (
              <a
                href={routes.legal("kvkk")}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                {chunks}
              </a>
            ),
          })}
        </span>
      </label>
      {errors.consent ? <p className="-mt-3 text-xs text-destructive">{err("consent")}</p> : null}

      {state.status === "error" ? (
        <p role="alert" className="text-sm text-destructive">
          {tRoot(state.code as never)}
        </p>
      ) : null}

      <Button type="submit" className="h-12 w-full" disabled={isPending || !token}>
        {isPending ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
