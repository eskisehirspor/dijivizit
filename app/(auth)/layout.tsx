import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { LegalLinks } from "@/components/legal/legal-links";
import { routes } from "@/lib/routes";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col items-center px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
      <div className="flex w-full max-w-sm animate-rise flex-col items-center">
        <Link href={routes.home} className="mb-14 transition-opacity hover:opacity-70 sm:mb-16">
          <Wordmark />
        </Link>
        <div className="w-full">{children}</div>
        <LegalLinks className="mt-14" />
      </div>
    </div>
  );
}
