"use client";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Optional row name ("İş", "Cep") shown on the card instead of the platform name. */
export function LinkLabelField({
  id,
  defaultValue,
  disabled,
  error,
}: {
  id: string;
  defaultValue?: string | null;
  disabled?: boolean;
  error?: string;
}) {
  const t = useTranslations("profile.links");

  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {t("fields.label")}
      </Label>
      <Input
        id={id}
        name="label"
        defaultValue={defaultValue ?? ""}
        maxLength={60}
        placeholder={t("labelPlaceholder")}
        className="h-10"
        disabled={disabled}
        aria-invalid={Boolean(error)}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
