"use client";

import { ArrowUpRight } from "lucide-react";

import { trackBeginCheckout } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Goes to the Shopier product page (secure card payment) and records the step. */
export function BuyButton({
  href,
  item,
  label,
  className,
}: {
  href: string;
  item: { id: string; name: string; price: number };
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={() => trackBeginCheckout(item)}
      className={cn(
        "inline-flex h-12 w-fit items-center gap-2 rounded-full bg-neutral-950 px-8 text-base font-medium text-white transition-colors hover:bg-neutral-800",
        className,
      )}
    >
      {label}
      <ArrowUpRight className="size-4" aria-hidden="true" />
    </a>
  );
}
