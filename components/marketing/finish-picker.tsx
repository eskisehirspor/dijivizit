"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

const FINISHES = [
  { id: "black", label: "Siyah metal", note: "Mat grafit, açık gri lazer kazıma." },
  { id: "silver", label: "Gümüş", note: "Mat fırçalanmış gümüş, koyu lazer kazıma." },
  { id: "gold", label: "Gold", note: "Mat fırçalanmış gold, koyu lazer kazıma." },
  { id: "wood", label: "Koyu ahşap", note: "Ceviz, lazerle yakılmış yazı." },
  { id: "wood-light", label: "Açık ahşap", note: "Meşe, lazerle yakılmış yazı." },
] as const;

type FinishId = (typeof FINISHES)[number]["id"];

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
          {current.note}
        </p>
      </div>
    </div>
  );
}
