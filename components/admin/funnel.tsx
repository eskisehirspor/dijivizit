import { percentOf } from "@/lib/admin/format";

/**
 * Horizontal funnel. Bars share one neutral tone and are scaled against the
 * first step, so each drop-off reads as lost width rather than a new colour.
 */
export function Funnel({ steps }: { steps: { key: string; label: string; value: number }[] }) {
  const base = steps[0]?.value ?? 0;

  return (
    <ol className="flex flex-col gap-4">
      {steps.map((step, index) => {
        const percent = percentOf(step.value, base);
        const previous = index > 0 ? steps[index - 1]!.value : null;
        const stepRate = previous !== null ? percentOf(step.value, previous) : null;

        return (
          <li key={step.key} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm">{step.label}</span>
              <span className="text-sm tabular-nums">
                <span className="font-medium">{step.value}</span>
                {stepRate !== null ? (
                  <span className="ml-2 text-xs text-muted-foreground">%{stepRate}</span>
                ) : null}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div
                className="h-full rounded-full bg-foreground/80 transition-[width] duration-500"
                style={{ width: `${Math.max(percent, step.value > 0 ? 2 : 0)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
