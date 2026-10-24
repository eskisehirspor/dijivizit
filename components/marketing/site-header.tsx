import Link from "next/link";

import { APP_ORIGIN } from "@/lib/hosts";
import { routes } from "@/lib/routes";

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
        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href={`${APP_ORIGIN}${routes.login}`}
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-white/50 sm:inline-flex"
          >
            Giriş yap
          </a>
          <Link
            href="/#iletisim"
            className="rounded-full px-3 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-white/50 sm:px-4"
          >
            İletişim
          </Link>
          <Link
            href="/siparis"
            className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Sipariş ver
          </Link>
        </nav>
      </div>
    </header>
  );
}
