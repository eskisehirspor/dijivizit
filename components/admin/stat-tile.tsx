export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-lg border border-border/60 p-5">
      <p className="text-xs text-pretty text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {hint ? (
        <p className="mt-auto text-xs text-pretty text-muted-foreground tabular-nums">{hint}</p>
      ) : null}
    </div>
  );
}
