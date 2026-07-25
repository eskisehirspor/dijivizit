"use client";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  isUsernamePlatform,
  USERNAME_PLATFORM_PREFIXES,
  type MvpLinkPlatform,
} from "@/lib/profile/platforms";
import { extractUsername } from "@/lib/validations/profile-links";
import { cn } from "@/lib/utils";

function valueLabelKey(platform: string): string {
  switch (platform) {
    case "phone":
    case "whatsapp":
      return "profile.links.valueLabels.phone";
    case "email":
      return "profile.links.valueLabels.email";
    case "website":
      return "profile.links.valueLabels.website";
    case "instagram":
    case "linkedin":
    case "x":
      return "profile.links.valueLabels.username";
    default:
      return "profile.links.fields.value";
  }
}

export function LinkValueField({
  platform,
  name = "value",
  defaultValue = "",
  disabled,
  required,
  error,
}: {
  platform: string;
  name?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}) {
  const t = useTranslations();
  const label = t(valueLabelKey(platform));
  const errorId = `${name}-error`;
  const isUsername = isUsernamePlatform(platform);
  const prefix = isUsername ? USERNAME_PLATFORM_PREFIXES[platform] : null;
  const inputDefault = isUsername ? extractUsername(platform, defaultValue) : defaultValue;

  return (
    <div className="grid gap-2">
      <Label htmlFor={name} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>

      {prefix ? (
        <div
          className={cn(
            "flex h-10 w-full items-stretch overflow-hidden rounded-lg border border-input",
            "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
            disabled && "opacity-50",
            error && "border-destructive aria-invalid:ring-destructive/20",
          )}
        >
          <span className="flex items-center bg-muted/40 px-2.5 text-xs text-muted-foreground select-none">
            {prefix}
          </span>
          <Input
            id={name}
            name={name}
            required={required}
            disabled={disabled}
            defaultValue={inputDefault}
            placeholder={t(`profile.links.placeholders.${platform as MvpLinkPlatform}`)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="h-full rounded-none border-0 focus-visible:ring-0"
          />
        </div>
      ) : (
        <Input
          id={name}
          name={name}
          required={required}
          disabled={disabled}
          defaultValue={inputDefault}
          placeholder={
            isMvpPlaceholder(platform) ? t(`profile.links.placeholders.${platform}`) : undefined
          }
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="h-10"
        />
      )}

      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function isMvpPlaceholder(platform: string): platform is MvpLinkPlatform {
  return (
    platform === "phone" ||
    platform === "email" ||
    platform === "website" ||
    platform === "linkedin" ||
    platform === "instagram" ||
    platform === "x" ||
    platform === "whatsapp"
  );
}
