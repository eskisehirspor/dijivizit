"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  useEffect(() => {
    // Replace with the real error reporter when one is introduced.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex max-w-sm animate-rise flex-col items-center gap-3">
        <h1 className="text-2xl font-semibold text-balance">{t("errors.genericTitle")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("errors.genericBody")}</p>
        <Button onClick={reset} className="mt-5">
          {t("common.retry")}
        </Button>
      </div>
    </div>
  );
}
