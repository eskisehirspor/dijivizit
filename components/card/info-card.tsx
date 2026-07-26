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
    <section className="rounded-lg border border-border/60 px-5 py-6 sm:px-6">
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
              <div className="flex items-center justify-between gap-3">
                <p
                  className={cn(
                    "min-w-0 flex-1 text-sm leading-relaxed text-pretty break-words",
                    row.valueClassName,
                  )}
                >
                  {row.value}
                </p>
                <CopyTextButton value={row.copy.value} label={row.copy.label} />
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
