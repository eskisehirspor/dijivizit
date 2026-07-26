"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export function CopyTextButton({ value, label }: { value: string; label: string }) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(t("common.copied"));
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("dashboard.copyFailed"));
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? t("common.copied") : label}
      className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
      ) : (
        <Copy aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
      )}
    </button>
  );
}
