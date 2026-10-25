import { Wallet } from "lucide-react";

import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** Downloads the signed pass; iPhone opens it straight into Wallet. */
export function AppleWalletButton({
  slug,
  label,
  className,
}: {
  slug: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={routes.appleWallet(slug)}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-black",
        className,
      )}
    >
      <Wallet aria-hidden="true" className="size-3.5" />
      {label}
    </a>
  );
}
