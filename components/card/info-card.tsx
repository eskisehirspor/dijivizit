import type { ReactNode } from "react";

import { CopyTextButton } from "@/components/card/copy-text-button";
import { cn } from "@/lib/utils";

export type InfoCardRow = {
  label: string;
  value: string;
  /** Optional monospace / wrap overrides for the value. */
  valueClassName?: string;
  /** When set, shows a far-right copy icon for this row. */
  copy?: {
    value: string;
    label: string;
  };
};

export function InfoCard({
  icon,
  title,
  rows,
  divided = true,
  action,
}: {
  icon: ReactNode;
  title: string;
  rows: InfoCardRow[];
  /** Hairline separators between header and rows (same as card border). */
  divided?: boolean;
  /** Optional primary action below the rows (e.g. view CV). */
  action?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border/60 px-5 pt-6 sm:px-6",
        // Rows carry their own py-3, so the card's own bottom inset is reduced
        // to keep the visual padding even with the 24px above the header.
        action ? "pb-4" : "pb-3",
      )}
    >
      <div className={cn(divided && "divide-y divide-border/60")}>
        <header className="flex min-h-9 items-center gap-4 pb-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {icon}
          </span>
          <h2 className="text-sm font-medium tracking-tight">{title}</h2>
        </header>

        {rows.map((row, index) => (
          <div key={`${row.label}-${index}`} className="space-y-1.5 py-3">
            <p className="text-xs text-muted-foreground">{row.label}</p>
            {row.copy ? (
              <div className="flex items-start justify-between gap-3">
                <p
                  className={cn(
                    "min-w-0 flex-1 text-sm leading-relaxed text-pretty break-words",
                    row.valueClassName,
                  )}
                >
                  {row.value}
                </p>
                {/* Pulled up so the tap target centres on the first line rather
                    than drifting to the middle of a multi-line address. */}
                <span className="-mt-2 flex shrink-0">
                  <CopyTextButton value={row.copy.value} label={row.copy.label} />
                </span>
              </div>
            ) : (
              <p
                className={cn(
                  "min-w-0 text-sm leading-relaxed text-pretty break-words",
                  row.valueClassName,
                )}
              >
                {row.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {action ? <div className="border-t border-border/60 pt-4">{action}</div> : null}
    </section>
  );
}
