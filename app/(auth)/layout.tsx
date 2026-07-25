import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { routes } from "@/lib/routes";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm animate-rise">
        <Link href={routes.home} className="mb-14 inline-block transition-opacity hover:opacity-70">
          <Wordmark />
        </Link>
        {children}
      </div>
    </div>
  );
}
