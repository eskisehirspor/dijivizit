import { Apple, ArrowDownRight, ArrowUpRight, Monitor, Smartphone } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { getOwnAnalyticsDetail, getOwnAnalyticsSummary } from "@/lib/dal/analytics";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { AnalyticsDetail } from "@/lib/validations/analytics";

export async function generateMetadata() {
  const t = await getTranslations("dashboard.analytics");
  return { title: t("title") };
}

const PERIODS = [7, 30, 90] as const;
const BRASS = "#9A7743";

/** Event types shown under "Neye dokundular?", in a fixed order. */
const ACTION_ORDER = [
  "whatsapp_click",
  "phone_click",
  "vcard_download",
  "email_click",
  "website_click",
  "linkedin_click",
  "document_open",
  "address_open",
  "share",
  "copy_link",
  "qr_open",
  "wallet_add",
] as const;

const fmt = new Intl.NumberFormat("tr-TR");
const regionName = new Intl.DisplayNames(["tr"], { type: "region" });

function flag(cc: string | null): string {
  if (!cc || !/^[A-Z]{2}$/.test(cc)) return "";
  return String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ gun?: string }>;
}) {
  const { gun } = await searchParams;
  const days = PERIODS.find((p) => String(p) === gun) ?? 30;
  const [t, detail, summary] = await Promise.all([
    getTranslations("dashboard.analytics"),
    getOwnAnalyticsDetail(days),
    getOwnAnalyticsSummary(),
  ]);

  return (
    <div className="flex animate-rise flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t("title")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("subtitle")}</p>
        <div className="pt-3">
          <Link
            href={routes.dashboard}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("backToDashboard")}
          </Link>
        </div>
      </div>

      <nav
        aria-label={t("period.label")}
        className="flex gap-1 self-start rounded-full bg-muted p-1"
      >
        {PERIODS.map((p) => (
          <Link
            key={p}
            href={`${routes.analytics}?gun=${p}`}
            aria-current={p === days ? "page" : undefined}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              p === days
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t("period.days", { days: p })}
          </Link>
        ))}
      </nav>

      {detail ? (
        <Insights t={t} d={detail} allTime={summary.profileViewsTotal} />
      ) : (
        <p className="text-sm text-muted-foreground">{t("daily.empty")}</p>
      )}
    </div>
  );
}

type T = Awaited<ReturnType<typeof getTranslations<"dashboard.analytics">>>;

function Insights({ t, d, allTime }: { t: T; d: AnalyticsDetail; allTime: number }) {
  const { totals } = d;
  const delta =
    totals.prevViews > 0
      ? Math.round(((totals.views - totals.prevViews) / totals.prevViews) * 100)
      : null;

  return (
    <>
      {/* KPI tiles */}
      <section className="grid grid-cols-2 gap-3">
        <Kpi
          label={t("kpi.views")}
          value={totals.views}
          foot={
            delta === null ? (
              <span>{t("kpi.noPrev")}</span>
            ) : (
              <span
                className={cn(
                  "inline-flex items-center gap-1",
                  delta >= 0 ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {delta >= 0 ? (
                  <ArrowUpRight className="size-3.5" />
                ) : (
                  <ArrowDownRight className="size-3.5" />
                )}
                {delta >= 0 ? "+" : ""}
                {delta}% {t("kpi.vsPrev", { days: d.days })}
              </span>
            )
          }
          strong
        />
        <Kpi
          label={t("kpi.visitors")}
          value={totals.visitors}
          foot={t("kpi.allTime", { count: fmt.format(allTime) })}
        />
        <Kpi
          label={t("kpi.saves")}
          value={totals.saves}
          foot={
            totals.visitors
              ? t("kpi.ofVisitors", { pct: pct(totals.saves, totals.visitors) })
              : null
          }
        />
        <Kpi
          label={t("kpi.contacts")}
          value={totals.contacts}
          foot={
            totals.visitors
              ? t("kpi.ofVisitors", { pct: pct(totals.contacts, totals.visitors) })
              : null
          }
        />
      </section>

      <Panel title={t("daily.title")}>
        <DailyChart t={t} daily={d.daily} />
      </Panel>

      <Panel title={t("heat.title")}>
        <Heatmap t={t} heat={d.heat} />
      </Panel>

      <Panel title={t("where.title")}>
        {d.cities.length === 0 && d.countries.length === 0 ? (
          <Empty>{t("where.empty")}</Empty>
        ) : (
          <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-medium text-muted-foreground">{t("where.cities")}</h3>
              <BarList
                items={d.cities.map((c) => ({
                  key: c.city,
                  label: `${flag(c.country)} ${c.city}`,
                  n: c.n,
                }))}
              />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-medium text-muted-foreground">{t("where.countries")}</h3>
              <BarList
                items={d.countries.map((c) => ({
                  key: c.country,
                  label: `${flag(c.country)} ${regionName.of(c.country) ?? c.country}`,
                  n: c.n,
                }))}
              />
            </div>
          </div>
        )}
        <p className="pt-4 text-xs text-muted-foreground">{t("where.note")}</p>
      </Panel>

      <div className="grid gap-6 sm:grid-cols-2">
        <Panel title={t("devices.title")}>
          <Devices t={t} devices={d.devices} />
        </Panel>
        <Panel title={t("sources.title")}>
          {d.sources.length === 0 ? (
            <Empty>{t("sources.empty")}</Empty>
          ) : (
            <BarList
              items={d.sources.map((s) => ({
                key: s.k,
                label: t.has(`sources.${s.k}`) ? t(`sources.${s.k}`) : s.k,
                n: s.n,
              }))}
            />
          )}
        </Panel>
      </div>

      <Panel title={t("funnel.title")}>
        <Funnel t={t} totals={totals} />
      </Panel>

      <Panel title={t("actions.title")}>
        {ACTION_ORDER.some((k) => d.actions[k]) ? (
          <BarList
            items={ACTION_ORDER.filter((k) => d.actions[k]).map((k) => ({
              key: k,
              label: t(`events.types.${k}`),
              n: d.actions[k] ?? 0,
            }))}
            sort
          />
        ) : (
          <Empty>{t("actions.empty")}</Empty>
        )}
      </Panel>

      {d.cards.length > 0 ? (
        <Panel title={t("cards.title")}>
          <BarList
            items={d.cards.map((c) => ({
              key: c.slug,
              label: c.label ?? t("cards.unnamed"),
              n: c.n,
            }))}
          />
        </Panel>
      ) : null}
    </>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-border/60 p-5 sm:p-6">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl bg-muted/60 p-4 text-sm text-pretty text-muted-foreground">
      {children}
    </p>
  );
}

function Kpi({
  label,
  value,
  foot,
  strong = false,
}: {
  label: string;
  value: number;
  foot?: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl p-5",
        strong ? "bg-foreground text-background" : "border border-border/60",
      )}
    >
      <p className={cn("text-xs", strong ? "text-background/70" : "text-muted-foreground")}>
        {label}
      </p>
      <p className="text-3xl font-semibold tracking-tight tabular-nums">{fmt.format(value)}</p>
      {foot ? (
        <p
          className={cn(
            "text-xs",
            strong ? "text-background/70 [&_span]:text-background" : "text-muted-foreground",
          )}
        >
          {foot}
        </p>
      ) : null}
    </div>
  );
}

/** Daily views as thin bars; hover or focus a day for its numbers. */
function DailyChart({ t, daily }: { t: T; daily: AnalyticsDetail["daily"] }) {
  const max = Math.max(1, ...daily.map((x) => x.v));
  const total = daily.reduce((s, x) => s + x.v, 0);
  if (total === 0) return <Empty>{t("daily.empty")}</Empty>;
  const label = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  const ticks = [0, Math.floor((daily.length - 1) / 2), daily.length - 1];
  const step = niceStep(max);
  const top = Math.ceil(max / step) * step;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-44">
        {[0, 0.5, 1].map((f) => (
          <div
            key={f}
            className="absolute inset-x-0 border-t border-dashed border-border/70"
            style={{ bottom: `${f * 100}%` }}
          >
            <span className="absolute -top-2.5 right-0 bg-background pl-1 text-[10px] text-muted-foreground tabular-nums">
              {f === 0 ? "" : fmt.format(Math.round(top * f))}
            </span>
          </div>
        ))}
        <div className="absolute inset-0 right-8 flex items-end gap-[2px]">
          {daily.map((x) => (
            <div
              key={x.d}
              tabIndex={0}
              className="group relative flex h-full flex-1 items-end outline-none"
              aria-label={`${label(x.d)}: ${t("daily.tooltip", { views: x.v, visitors: x.u })}`}
            >
              <div
                className="w-full rounded-t-[3px] bg-foreground/85 transition-colors group-hover:bg-[var(--brass)] group-focus:bg-[var(--brass)]"
                style={{
                  height: `${(x.v / top) * 100}%`,
                  minHeight: x.v ? 3 : 0,
                  ["--brass" as string]: BRASS,
                }}
              />
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded-lg bg-foreground px-2.5 py-1.5 text-[11px] whitespace-nowrap text-background shadow-lg group-hover:block group-focus:block">
                <b className="font-semibold">{label(x.d)}</b> ·{" "}
                {t("daily.tooltip", { views: x.v, visitors: x.u })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative mr-8 h-4 text-[10px] text-muted-foreground">
        {ticks.map((i, k) => (
          <span
            key={i}
            className="absolute whitespace-nowrap"
            style={{
              left: `${((i + 0.5) / daily.length) * 100}%`,
              transform: k === 0 ? "none" : k === 2 ? "translateX(-100%)" : "translateX(-50%)",
            }}
          >
            {label(daily[i]!.d)}
          </span>
        ))}
      </div>
    </div>
  );
}

function niceStep(max: number): number {
  const raw = max / 2;
  const mag = 10 ** Math.floor(Math.log10(Math.max(raw, 1)));
  const n = raw / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * mag;
}

/** Weekday x hour grid, one brass ramp from empty to busiest. */
function Heatmap({ t, heat }: { t: T; heat: AnalyticsDetail["heat"] }) {
  const grid = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
  for (const c of heat) grid[c.w]![c.h] = c.n;
  const max = Math.max(0, ...heat.map((c) => c.n));
  if (max === 0) return <Empty>{t("daily.empty")}</Empty>;
  const days = t.raw("heat.days") as string[];
  const daysLong = t.raw("heat.daysLong") as string[];
  let peak = { w: 0, h: 0, n: 0 };
  for (const c of heat) if (c.n > peak.n) peak = c;
  const level = (n: number) => (n === 0 ? 0 : 0.18 + 0.82 * (n / max));

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        {t("heat.peak", { day: daysLong[peak.w]!, hour: String(peak.h).padStart(2, "0") })}
      </p>
      <div className="grid grid-cols-[2rem_1fr] gap-x-2 gap-y-[3px]">
        {grid.map((row, w) => (
          <div key={w} className="contents">
            <span className="self-center text-[10px] text-muted-foreground">{days[w]}</span>
            <div
              className="grid grid-cols-24 gap-[3px]"
              style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
            >
              {row.map((n, h) => (
                <div
                  key={h}
                  tabIndex={0}
                  className="group relative aspect-square rounded-[3px] outline-none"
                  style={{ background: n ? BRASS : "var(--muted)", opacity: n ? level(n) : 1 }}
                  aria-label={t("heat.cell", {
                    day: daysLong[w]!,
                    hour: String(h).padStart(2, "0"),
                    count: n,
                  })}
                >
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 rounded-lg bg-foreground px-2.5 py-1.5 text-[11px] whitespace-nowrap text-background opacity-100 shadow-lg group-hover:block group-focus:block">
                    {t("heat.cell", {
                      day: daysLong[w]!,
                      hour: String(h).padStart(2, "0"),
                      count: n,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <span />
        <div className="relative mt-1 h-3 text-[10px] text-muted-foreground">
          {[0, 6, 12, 18].map((h) => (
            <span key={h} className="absolute" style={{ left: `${(h / 24) * 100}%` }}>
              {String(h).padStart(2, "0")}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 self-end text-[10px] text-muted-foreground">
        {t("heat.legendLow")}
        {[0.18, 0.45, 0.72, 1].map((o) => (
          <span
            key={o}
            className="size-3 rounded-[3px]"
            style={{ background: BRASS, opacity: o }}
          />
        ))}
        {t("heat.legendHigh")}
      </div>
    </div>
  );
}

/** Ranked list with a thin bar per row; numbers in text ink, never in the bar colour. */
function BarList({
  items,
  sort = false,
}: {
  items: { key: string; label: string; n: number }[];
  sort?: boolean;
}) {
  const rows = sort ? [...items].sort((a, b) => b.n - a.n) : items;
  const max = Math.max(1, ...rows.map((r) => r.n));
  const total = rows.reduce((s, r) => s + r.n, 0);
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <li key={r.key} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate">{r.label}</span>
            <span className="shrink-0 tabular-nums">
              {fmt.format(r.n)}{" "}
              <span className="text-xs text-muted-foreground">%{pct(r.n, total)}</span>
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(r.n / max) * 100}%`,
                background: i === 0 ? BRASS : "var(--foreground)",
                opacity: i === 0 ? 1 : 0.8,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Devices({ t, devices }: { t: T; devices: AnalyticsDetail["devices"] }) {
  const total = devices.reduce((s, x) => s + x.n, 0);
  if (total === 0) return <Empty>{t("devices.empty")}</Empty>;
  const by = Object.fromEntries(devices.map((x) => [x.k, x.n]));
  const rows = [
    { k: "ios", icon: Apple },
    { k: "android", icon: Smartphone },
    { k: "desktop", icon: Monitor },
  ] as const;
  return (
    <div className="grid grid-cols-3 gap-3">
      {rows.map(({ k, icon: Icon }) => (
        <div key={k} className="flex flex-col items-start gap-2 rounded-xl bg-muted/60 p-3">
          <Icon className="size-4 text-muted-foreground" />
          <span className="text-2xl font-semibold tracking-tight tabular-nums">
            %{pct(by[k] ?? 0, total)}
          </span>
          <span className="text-xs text-muted-foreground">{t(`devices.${k}`)}</span>
        </div>
      ))}
    </div>
  );
}

function Funnel({ t, totals }: { t: T; totals: AnalyticsDetail["totals"] }) {
  const steps = [
    { k: "views", n: totals.views },
    { k: "taps", n: totals.taps },
    { k: "saves", n: totals.saves },
    { k: "contacts", n: totals.contacts },
  ] as const;
  const base = Math.max(1, totals.views);
  return (
    <div className="flex flex-col gap-3">
      {steps.map((s, i) => (
        <div key={s.k} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5">
          <span className="text-sm">{t(`funnel.${s.k}`)}</span>
          <span className="text-sm tabular-nums">
            {fmt.format(s.n)}{" "}
            {i > 0 ? (
              <span className="text-xs text-muted-foreground">%{pct(s.n, totals.views)}</span>
            ) : null}
          </span>
          <div className="col-span-2 h-7 overflow-hidden rounded-lg bg-muted">
            <div
              className="h-full rounded-lg"
              style={{
                width: `${Math.max(s.n ? 2 : 0, (s.n / base) * 100)}%`,
                background: i === 3 ? BRASS : "var(--foreground)",
                opacity: i === 3 ? 1 : 1 - i * 0.2,
              }}
            />
          </div>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">{t("funnel.hint")}</p>
    </div>
  );
}
