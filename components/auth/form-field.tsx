"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  name: string;
  /** Sits opposite the label, e.g. a password recovery link. */
  labelAction?: React.ReactNode;
  /** Already-translated message; omitted when the field is valid. */
  error?: string;
};

export function FormField({
  label,
  name,
  labelAction,
  error,
  className,
  type,
  ...inputProps
}: FormFieldProps) {
  const t = useTranslations("auth.fields");
  const errorId = `${name}-error`;
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={name} className="text-xs font-medium text-muted-foreground">
          {label}
        </Label>
        {labelAction}
      </div>
      {/* The base control scale is deliberately dense for dashboard use; auth
          forms get the roomier target. */}
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={isPassword && revealed ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn("h-10", isPassword && "pr-10", className)}
          {...inputProps}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? t("hidePassword") : t("showPassword")}
            aria-pressed={revealed}
            aria-controls={name}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {revealed ? (
              <EyeOff aria-hidden="true" className="size-4" />
            ) : (
              <Eye aria-hidden="true" className="size-4" />
            )}
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
