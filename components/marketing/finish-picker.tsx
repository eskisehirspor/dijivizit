"use client";

import { useState } from "react";

import Link from "next/link";

import { FINISHES, formatTry, type FinishId } from "@/lib/orders/finishes";
import { cn } from "@/lib/utils";

/** Rendered stills of the card in each finish, crossfaded by a segmented control. */
export function FinishPicker() {
  const [active, setActive] = useState<FinishId>("black");
  const current = FINISHES.find((f) => f.id === active)!;

  return (
    <div className="flex flex-col gap-8">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-[#d9d6d1]">
        {FINISHES.map((f) => (
          // eslint-disable-next-line @next/next/no-img-element -- static rendered stills
          <img
            key={f.id}
            src={`/landing/finishes/${f.id}.webp`}
            alt={`${f.label} Dijivizit NFC kartvizit`}
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out",
              f.id === active ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <div
          role="radiogroup"
          aria-label="Kart kaplaması"
          className="inline-flex flex-wrap justify-center gap-1 rounded-full bg-muted p-1"
        >
          {FINISHES.map((f) => (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={f.id === active}
              onClick={() => setActive(f.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                f.id === active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {current.note} <span className="font-medium text-foreground">{formatTry(current.price)}</span>, KDV
          dahil, kargo ücretsiz.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/siparis?kaplama=${current.id}`}
            className="inline-flex h-11 items-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            {current.label} sipariş ver
          </Link>
          <Link
            href={`/kartvizit/${current.slug}`}
            className="inline-flex h-11 items-center rounded-full px-5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Ürün detayları
          </Link>
        </div>
      </div>
    </div>
  );
}
