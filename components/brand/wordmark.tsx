"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const MARK_PX = 72;
const TYPE_PX = 40;

/**
 * Contactless arcs radiating from a tap point — the gesture the product is built
 * around. Knockouts are painted with --background rather than white so the mark
 * stays correct on both themes.
 */
export function Logomark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={MARK_PX}
      height={MARK_PX}
      aria-hidden="true"
      className={cn("shrink-0", className)}
      style={{ width: MARK_PX, height: MARK_PX }}
    >
      <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" />
      <circle cx="8.6" cy="12" r="1.35" fill="var(--background)" />
      <g fill="none" stroke="var(--background)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M12.1 8.3a4.6 4.6 0 0 1 0 7.4" />
        <path d="M15.4 5.9a8.6 8.6 0 0 1 0 12.2" />
      </g>
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  const t = useTranslations("app");

  return (
    <span className={cn("inline-flex items-center gap-4", className)}>
      <Logomark />
      {/* Slightly tighter than the type scale default; logotypes read as one
          object only when the letterspacing is pulled in. */}
      <span className="leading-none font-medium tracking-[-0.03em]" style={{ fontSize: TYPE_PX }}>
        {t("name")}
      </span>
    </span>
  );
}
