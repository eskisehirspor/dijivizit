import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Funnel } from "@/components/admin/funnel";
import { StatTile } from "@/components/admin/stat-tile";
import type { SiteSummary } from "@/lib/dal/admin";
import { finishLabel, formatTry, isFinishId } from "@/lib/orders/finishes";
import { cn } from "@/lib/utils";

export const SITE_PERIODS = [7, 30, 90] as const;

const LINKS = [
  { label: "Shopier siparişleri", href: "https://www.shopier.com/s/orders" },
  { label: "Google Analytics", href: "https://analytics.google.com/" },
  {
    label: "Search Console",
    href: "https://search.google.com/search-console?resource_id=sc-domain:dijivizit.com",
  },
  { label: "Meta Events Manager", href: "https://business.facebook.com/events_manager2" },
];

const DEVICE_LABEL: Record<string, string> = {
  mobile: "Mobil",
  desktop: "Masaüstü",
  tablet: "Tablet",
  unknown: "Bilinmiyor",
};

function productName(item: string) {
  return isFinishId(item) ? finishLabel(item) : item;
}

function refName(host: string) {
  if (host === "direct") return "Doğrudan / bilinmiyor";
  return host.replace(/^www\./, "");
}

/** Daily visits as bars; days with a paid order get a dot. Inline SVG, no deps. */
function DailyChart({ daily }: { daily: SiteSummary["daily"] }) {
  const max = Math.max(1, ...daily.map((d) => d.sessions));
  const w = 100 / Math.max(1, daily.length);
  return (
    <figure className="flex flex-col gap-2">
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="h-32 w-full"
        role="img"
        aria-label="Günlük ziyaret"
      >
        {daily.map((d, i) => {
          const h = (d.sessions / max) * 34;
          return (
            <g key={d.d}>
              <rect
                x={i * w + w * 0.15}
                y={38 - h}
                width={w * 0.7}
                height={Math.max(h, d.sessions > 0 ? 0.8 : 0.3)}
                className="fill-foreground/70"
              >
                <title>{`${d.d}: ${d.sessions} ziyaret, ${d.views} sayfa${d.orders ? `, ${d.orders} sipariş` : ""}`}</title>
              </rect>
              {d.orders > 0 ? (
                <circle cx={i * w + w / 2} cy={2.5} r={1.2} className="fill-emerald-600" />
              ) : null}
            </g>
          );
        })}
      </svg>
      <figcaption className="flex justify-between text-xs text-muted-foreground tabular-nums">
        <span>{daily[0]?.d.slice(5).split("-").reverse().join(".")}</span>
        <span>Günlük ziyaret · yeşil nokta = ödenen sipariş</span>
        <span>{daily.at(-1)?.d.slice(5).split("-").reverse().join(".")}</span>
      </figcaption>
    </figure>
  );
}

function TopList({
  title,
  rows,
  empty = "Henüz veri yok",
}: {
  title: string;
  rows: { label: string; value: string | number }[];
  empty?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-5">
      <h3 className="text-sm font-medium">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-2 text-sm">
          {rows.map((r) => (
            <li key={r.label} className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate">{r.label}</span>
              <span className="shrink-0 text-muted-foreground tabular-nums">{r.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SiteOverview({ summary, newUsers }: { summary: SiteSummary; newUsers: number }) {
  const f = summary.funnel;
  const n = (k: string) => f[k] ?? 0;

  return (
    <section className="flex flex-col gap-6" aria-labelledby="site-overview">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="site-overview" className="text-lg font-semibold tracking-tight">
            Site ve satış özeti
          </h2>
          <p className="text-sm text-muted-foreground">
            dijivizit.com ziyaretleri, satış hunisi, Shopier ödemeleri ve kayıtlar tek yerde.
          </p>
        </div>
        <nav className="flex gap-1.5" aria-label="Dönem">
          {SITE_PERIODS.map((d) => (
            <Link
              key={d}
              href={`?gun=${d}`}
              scroll={false}
              className={cn(
                "h-8 rounded-full px-3 text-xs leading-8 font-medium tabular-nums transition-colors",
                summary.days === d
                  ? "bg-foreground text-background"
                  : "border border-border hover:bg-muted",
              )}
            >
              {d} gün
            </Link>
          ))}
        </nav>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <li>
          <StatTile
            label="Ziyaret"
            value={summary.sessions}
            hint={`${summary.pageviews} sayfa görüntüleme`}
          />
        </li>
        <li>
          <StatTile
            label="Ciro (Shopier)"
            value={formatTry(summary.revenue)}
            hint={`${summary.paidOrders} ödenen sipariş`}
          />
        </li>
        <li>
          <StatTile label="Teklif talebi" value={summary.requests} hint="Sipariş formundan" />
        </li>
        <li>
          <StatTile
            label="Yeni kayıt"
            value={newUsers}
            hint={`Kartvizit görüntüleme: ${summary.cardViews}`}
          />
        </li>
      </ul>

      <div className="rounded-lg border border-border/60 p-5">
        <DailyChart daily={summary.daily} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-lg border border-border/60 p-5">
          <h3 className="text-sm font-medium">Satış hunisi</h3>
          <Funnel
            steps={[
              { key: "visit", label: "Ziyaret", value: summary.sessions },
              { key: "view", label: "Ürün sayfası görüntüleme", value: n("view_item") },
              { key: "checkout", label: "Satın al / form başlatma", value: n("begin_checkout") },
              {
                key: "won",
                label: "Ödeme veya teklif talebi",
                value: summary.paidOrders + summary.requests,
              },
            ]}
          />
          <p className="text-xs text-muted-foreground tabular-nums">
            Ücretsiz araçlar: {n("tool_start")} başlatma · {n("qr_download")} QR indirme ·{" "}
            {n("tool_offer_click")} teklife tıklama
          </p>
        </div>
        <TopList
          title="Ürünler (görüntüleme / satın al tıklaması)"
          rows={summary.products.map((p) => ({
            label: productName(p.item),
            value: `${p.views} / ${p.clicks}`,
          }))}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <TopList
          title="En çok bakılan sayfalar"
          rows={summary.topPaths.map((p) => ({ label: p.path, value: p.n }))}
        />
        <TopList
          title="Nereden geldiler"
          rows={summary.topRefs.map((r) => ({ label: refName(r.host), value: r.n }))}
        />
        <TopList
          title="Cihaz"
          rows={Object.entries(summary.devices)
            .sort((a, b) => b[1] - a[1])
            .map(([k, v]) => ({ label: DEVICE_LABEL[k] ?? k, value: v }))}
        />
        <TopList title="Ülke" rows={summary.countries.map((c) => ({ label: c.c, value: c.n }))} />
      </div>

      <div className="flex flex-wrap gap-2">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-3 text-sm hover:bg-muted"
          >
            {l.label}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Bu sayılar çerezsiz, kendi ölçümümüz: çerezi reddedenler de sayılır, bu yüzden Google
        Analytics&apos;ten yüksek çıkabilir. Ziyaretler 3 Kasım 2026&apos;dan itibaren tutuluyor.
      </p>
    </section>
  );
}
