"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useActionState, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  setCoverAction,
  setThemeAction,
  setVanitySlugAction,
} from "@/app/actions/profile-appearance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionResult } from "@/lib/action-result";
import { AVATAR_MIME_TYPES } from "@/lib/profile/avatar";
import { CARD_THEMES } from "@/lib/profile/themes";
import { uploadOwnImage } from "@/lib/profile/upload-image";
import { cn } from "@/lib/utils";

const SECTION = "flex flex-col gap-5 rounded-lg border border-border/60 p-6";

export function ThemePicker({ current }: { current: string }) {
  const t = useTranslations("profile.appearance.theme");
  const router = useRouter();
  const [selected, setSelected] = useState(current);
  const [pending, start] = useTransition();

  function choose(id: string) {
    const previous = selected;
    setSelected(id);
    start(async () => {
      const result = await setThemeAction(id);
      if (!result.ok) {
        setSelected(previous);
        toast.error(t("saveFailed"));
        return;
      }
      router.refresh();
      toast.success(t("saved"));
    });
  }

  return (
    <section className={SECTION}>
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">{t("title")}</h2>
        <p className="text-xs text-pretty text-muted-foreground">{t("subtitle")}</p>
      </div>
      <div
        className="grid grid-cols-3 gap-3 sm:grid-cols-5"
        role="radiogroup"
        aria-label={t("title")}
      >
        {CARD_THEMES.map((theme) => {
          const active = selected === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={pending}
              onClick={() => choose(theme.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-3 text-xs transition-colors",
                active ? "border-foreground" : "border-border/60 hover:border-border",
              )}
            >
              <span
                className="relative flex h-10 w-full items-end justify-center overflow-hidden rounded-md"
                style={{ background: theme.dark ? "#0a0a0a" : "#f5f5f5" }}
              >
                <span
                  className="mb-1.5 h-3 w-4/5 rounded-sm"
                  style={{ background: theme.accent }}
                />
                {active ? (
                  <Check
                    aria-hidden="true"
                    className="absolute top-1 right-1 size-3.5"
                    style={{ color: theme.dark ? "#fafafa" : "#171717" }}
                  />
                ) : null}
              </span>
              {t(`names.${theme.id}`)}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function VanityForm({
  current,
  suggestion,
  siteUrl,
}: {
  current: string | null;
  suggestion: string;
  siteUrl: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [state, formAction, pending] = useActionState<
    ActionResult<{ slug: string | null }> | null,
    FormData
  >(async (prev, data) => {
    const result = await setVanitySlugAction(prev, data);
    if (result.ok) {
      toast.success(t("profile.appearance.vanity.saved"));
      router.refresh();
    }
    return result;
  }, null);

  const error = state && !state.ok ? state.fieldErrors?.slug : undefined;

  return (
    <section className={SECTION}>
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">{t("profile.appearance.vanity.title")}</h2>
        <p className="text-xs text-pretty text-muted-foreground">
          {t("profile.appearance.vanity.subtitle")}
        </p>
      </div>
      <form action={formAction} className="flex flex-col gap-3">
        <Label htmlFor="vanity-slug" className="font-mono text-xs text-muted-foreground">
          {siteUrl}/p/
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="vanity-slug"
            name="slug"
            defaultValue={current ?? ""}
            placeholder={suggestion || "ad-soyad"}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            maxLength={40}
            aria-invalid={Boolean(error) || undefined}
            className="font-mono"
          />
          <Button type="submit" className="h-10" disabled={pending}>
            {pending ? t("common.loading") : t("common.save")}
          </Button>
        </div>
        {error ? <p className="text-xs text-destructive">{t(error)}</p> : null}
        <p className="text-xs text-pretty text-muted-foreground">
          {t("profile.appearance.vanity.hint")}
        </p>
      </form>
    </section>
  );
}

export function CoverManager({ coverUrl }: { coverUrl: string | null }) {
  const t = useTranslations();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(coverUrl);
  const [pending, start] = useTransition();

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    start(async () => {
      const uploaded = await uploadOwnImage(file);
      if (!uploaded.ok) {
        toast.error(t(uploaded.code));
        return;
      }
      const result = await setCoverAction(uploaded.path);
      if (!result.ok) {
        toast.error(t(result.code));
        return;
      }
      setPreview(result.data.coverUrl);
      router.refresh();
      toast.success(t("profile.appearance.cover.saved"));
    });
  }

  function remove() {
    start(async () => {
      const result = await setCoverAction(null);
      if (!result.ok) {
        toast.error(t(result.code));
        return;
      }
      setPreview(null);
      router.refresh();
      toast.success(t("profile.appearance.cover.removed"));
    });
  }

  return (
    <section className={SECTION}>
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">{t("profile.appearance.cover.title")}</h2>
        <p className="text-xs text-pretty text-muted-foreground">
          {t("profile.appearance.cover.subtitle")}
        </p>
      </div>
      <div className="aspect-[3/1] w-full overflow-hidden rounded-lg bg-muted">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote storage URL
          <img src={preview} alt="" className="size-full object-cover" />
        ) : null}
      </div>
      <div className="flex flex-wrap gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={AVATAR_MIME_TYPES.join(",")}
          className="sr-only"
          disabled={pending}
          onChange={onFile}
        />
        <Button
          type="button"
          className="h-10"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
        >
          {pending
            ? t("common.loading")
            : preview
              ? t("profile.appearance.cover.replace")
              : t("profile.appearance.cover.upload")}
        </Button>
        {preview ? (
          <Button
            type="button"
            variant="ghost"
            className="h-10"
            disabled={pending}
            onClick={remove}
          >
            {t("profile.appearance.cover.remove")}
          </Button>
        ) : null}
      </div>
      <p className="text-xs text-pretty text-muted-foreground">
        {t("profile.appearance.cover.hint")}
      </p>
    </section>
  );
}
