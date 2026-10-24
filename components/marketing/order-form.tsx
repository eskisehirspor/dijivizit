"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { submitOrderRequestAction, type OrderFormState } from "@/app/actions/order-request";
import { CONTACT } from "@/lib/contact";
import { FINISHES, type FinishId } from "@/lib/orders/finishes";
import { cn } from "@/lib/utils";

const INITIAL: OrderFormState = { status: "idle" };

function Field({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive";

export function OrderForm({ initialFinish }: { initialFinish: FinishId }) {
  const [state, formAction, isPending] = useActionState(submitOrderRequestAction, INITIAL);
  const [finish, setFinish] = useState<FinishId>(initialFinish);
  const [startedAt] = useState(() => Date.now());
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-start gap-6 rounded-3xl border border-border/60 p-8 sm:p-12">
        <span className="flex size-12 items-center justify-center rounded-full bg-neutral-950 text-white">
          <Check className="size-6" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Teşekkürler{state.firstName ? ` ${state.firstName}` : ""}, talebini aldık.
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            En kısa sürede seninle iletişime geçeceğiz. E-posta adresine bir onay da gönderdik. Acil
            bir durum için {CONTACT.phoneDisplay} numarasından bize ulaşabilirsin.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-12 items-center rounded-full border border-border px-6 text-base font-medium transition-colors hover:bg-muted"
        >
          Ana sayfaya dön
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-12" noValidate>
      <input type="hidden" name="started_at" value={startedAt} />
      {/* Honeypot: hidden from people, filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Web sitesi
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-5 text-xl font-semibold tracking-tight">1. Kaplamayı seç</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {FINISHES.map((f) => {
            const selected = f.id === finish;
            return (
              <label
                key={f.id}
                className={cn(
                  "group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-[#d9d6d1] transition-all",
                  selected
                    ? "border-neutral-950 ring-2 ring-neutral-950"
                    : "border-border/60 hover:border-neutral-400",
                )}
              >
                <input
                  type="radio"
                  name="finish"
                  value={f.id}
                  checked={selected}
                  onChange={() => setFinish(f.id)}
                  className="sr-only"
                />
                {/* eslint-disable-next-line @next/next/no-img-element -- static rendered stills */}
                <img
                  src={`/landing/finishes/${f.id}.webp`}
                  alt=""
                  width={1600}
                  height={900}
                  className="aspect-[4/3] w-full scale-[1.6] object-cover transition-transform duration-500 group-hover:scale-[1.7]"
                />
                <span className="flex items-center justify-between gap-2 bg-background px-3 py-3 text-sm font-medium">
                  {f.label}
                  {selected ? <Check className="size-4" aria-hidden="true" /> : null}
                </span>
              </label>
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground">
          {FINISHES.find((f) => f.id === finish)?.note}
        </p>
        {errors.finish ? <p className="text-sm text-destructive">{errors.finish}</p> : null}

        <div className="max-w-40">
          <Field label="Adet" name="quantity" error={errors.quantity}>
            <input
              id="quantity"
              name="quantity"
              type="number"
              inputMode="numeric"
              min={1}
              max={1000}
              defaultValue={1}
              required
              aria-invalid={errors.quantity ? true : undefined}
              className={inputClass}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-5 text-xl font-semibold tracking-tight">
          2. İletişim bilgilerin
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Ad soyad" name="fullName" error={errors.fullName}>
              <input
                id="fullName"
                name="fullName"
                autoComplete="name"
                required
                aria-invalid={errors.fullName ? true : undefined}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Telefon" name="phone" error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="05xx xxx xx xx"
              required
              aria-invalid={errors.phone ? true : undefined}
              className={inputClass}
            />
          </Field>
          <Field label="E-posta" name="email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="ornek@mail.com"
              required
              aria-invalid={errors.email ? true : undefined}
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field
              label="Not (isteğe bağlı)"
              name="note"
              error={errors.note}
              hint="Kartta yer alacak isim/unvan, logo, teslimat şehri gibi detaylar."
            >
              <textarea
                id="note"
                name="note"
                rows={4}
                maxLength={1500}
                aria-invalid={errors.note ? true : undefined}
                className={cn(inputClass, "h-auto py-3")}
              />
            </Field>
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 size-4 shrink-0 accent-neutral-950"
          />
          <span>
            Talebimin yanıtlanması için iletişim bilgilerimin işlenmesine izin veriyorum.{" "}
            <Link href="/yasal/kvkk" className="underline underline-offset-4" target="_blank">
              KVKK aydınlatma metni
            </Link>
          </span>
        </label>
        {errors.consent ? <p className="text-sm text-destructive">{errors.consent}</p> : null}
      </fieldset>

      <div className="flex flex-col items-start gap-4">
        {state.status === "error" ? (
          <p role="alert" className="text-sm text-destructive">
            {state.message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-neutral-950 px-8 text-base font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-60"
        >
          {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          Talep oluştur
        </button>
        <p className="text-sm text-muted-foreground">
          Ödeme şimdi alınmaz. Talebini aldıktan sonra seni arayıp tasarım ve fiyatı netleştiririz.
        </p>
      </div>
    </form>
  );
}
