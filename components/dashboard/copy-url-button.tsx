"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function CopyUrlButton({ url, label }: { url: string; label?: string }) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t("common.copied"));
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("dashboard.copyFailed"));
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleCopy} className="shrink-0">
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      {copied ? t("common.copied") : (label ?? t("common.copy"))}
    </Button>
  );
}
