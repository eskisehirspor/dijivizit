const DATE_FORMAT = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const RELATIVE_FORMAT = new Intl.RelativeTimeFormat("tr-TR", { numeric: "always" });

export function formatDate(value: string | null): string {
  return value ? DATE_FORMAT.format(new Date(value)) : "—";
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["week", 7 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
];

/** "3 gün önce", "2 ay önce" — "az önce" under a minute. */
export function formatRelative(value: string | null, now: Date = new Date()): string {
  if (!value) {
    return "—";
  }

  const seconds = Math.round((new Date(value).getTime() - now.getTime()) / 1000);

  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) {
      return RELATIVE_FORMAT.format(Math.round(seconds / size), unit);
    }
  }

  return "az önce";
}

export function percentOf(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}
