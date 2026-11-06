import Link from "next/link";

import { productImage } from "@/lib/marketing/products";
import { FINISHES, PRICING, formatPrice } from "@/lib/orders/finishes";

/** "Ürünler": a hover/focus dropdown on desktop, a plain link on phones. */
function ProductsMenu() {
  return (
    <div className="group relative">
      <Link
        href="/kartvizit"
        aria-haspopup="true"
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-2 text-sm font-medium whitespace-nowrap text-neutral-800 transition-colors hover:bg-white/50 sm:px-4"
      >
        Ürünler
        <svg viewBox="0 0 12 12" className="hidden size-3 sm:block" aria-hidden="true">
          <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </Link>
      <div className="invisible absolute top-full left-1/2 hidden w-[560px] -translate-x-1/2 pt-2 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 sm:block">
        <ul className="grid grid-cols-2 gap-1 rounded-2xl border border-border/60 bg-white p-2 shadow-xl">
          {FINISHES.map((f) => (
            <li key={f.id}>
              <Link
                href={`/kartvizit/${f.slug}`}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-neutral-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static stills; no image optimizer on Workers */}
                <img
                  src={productImage(f)}
                  alt=""
                  width={48}
                  height={60}
                  loading="lazy"
                  className="h-[60px] w-12 shrink-0 rounded-lg bg-[#d9d6d1] object-cover"
                />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-neutral-900">
                    {f.name.replace(/ \(.*\)$/, "")}
                  </span>
                  <span className="text-xs text-neutral-600">{formatPrice(f)}</span>
                </span>
              </Link>
            </li>
          ))}
          <li className="col-span-2 border-t border-border/60 pt-1">
            <Link
              href="/siparis"
              className="flex items-center justify-between rounded-xl p-3 text-sm transition-colors hover:bg-neutral-100"
            >
              <span className="font-medium text-neutral-900">Kurumsal ve toplu sipariş</span>
              <span className="text-xs text-neutral-600">
                {PRICING.bulkMinQuantity}+ adette %{PRICING.bulkDiscountPercent} indirim, firma
                logosu
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-white/40 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-70">
          <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" />
            <circle cx="8.6" cy="12" r="1.35" fill="white" />
            <g fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round">
              <path d="M12.1 8.3a4.6 4.6 0 0 1 0 7.4" />
              <path d="M15.4 5.9a8.6 8.6 0 0 1 0 12.2" />
            </g>
          </svg>
          <span className="text-lg font-semibold tracking-[-0.03em]">Dijivizit</span>
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1 lg:gap-2">
          <Link
            href="/#ozellikler"
            className="hidden rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap text-neutral-800 transition-colors hover:bg-white/50 lg:inline-flex"
          >
            Özellikler
          </Link>
          <ProductsMenu />
          <Link
            href="/kartvizit"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-white/50 sm:inline-flex"
          >
            Fiyatlar
          </Link>
          <Link
            href="/rehber"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-white/50 sm:inline-flex"
          >
            Rehber
          </Link>
          <Link
            href="/#iletisim"
            className="rounded-full px-2.5 py-2 text-sm font-medium whitespace-nowrap text-neutral-800 transition-colors hover:bg-white/50 sm:px-4"
          >
            İletişim
          </Link>
          <Link
            href="/siparis"
            className="rounded-full bg-neutral-950 px-3.5 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-neutral-800 sm:px-4"
          >
            Sipariş ver
          </Link>
        </nav>
      </div>
    </header>
  );
}
