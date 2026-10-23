"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  finalizeAvatarUploadAction,
  removeAvatarAction,
  reserveAvatarUploadAction,
} from "@/app/actions/profile-avatar";
import { AvatarPreview } from "@/components/profile/avatar-preview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AVATAR_BUCKET, AVATAR_MIME_TYPES } from "@/lib/profile/avatar";
import { createClient } from "@/lib/supabase/client";
import { validateAvatarFile } from "@/lib/validations/profile-avatar";

export function AvatarManager({ avatarUrl, alt }: { avatarUrl: string | null; alt: string }) {
  const t = useTranslations();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  // The last upload/remove wins until the server's avatarUrl catches up with
  // it. Without this, a slightly stale refresh could bring a removed photo
  // back on screen (or hide a fresh one) even though the save succeeded.
  const [override, setOverride] = useState<{ url: string | null } | null>(null);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [isUploading, startUpload] = useTransition();
  const [isRemoving, startRemove] = useTransition();

  if (override && override.url === avatarUrl) {
    setOverride(null);
  }

  const previewUrl = override ? override.url : avatarUrl;

  const busy = isUploading || isRemoving;
  const accept = AVATAR_MIME_TYPES.join(",");

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const local = validateAvatarFile(file);
    if (!local.ok) {
      toast.error(
        t(
          local.code === "size"
            ? "profile.avatar.errors.tooLarge"
            : local.code === "empty"
              ? "profile.avatar.errors.empty"
              : "profile.avatar.errors.typeInvalid",
        ),
      );
      return;
    }

    const hadAvatar = Boolean(previewUrl);

    startUpload(async () => {
      try {
        const reserved = await reserveAvatarUploadAction({ type: file.type, size: file.size });
        if (!reserved.ok) {
          toast.error(t(reserved.code));
          return;
        }

        const { error: uploadError } = await createClient()
          .storage.from(AVATAR_BUCKET)
          .upload(reserved.data.path, file, {
            contentType: file.type,
            upsert: false,
            cacheControl: "3600",
          });

        if (uploadError) {
          toast.error(t("profile.avatar.errors.uploadFailed"));
          return;
        }

        const result = await finalizeAvatarUploadAction(reserved.data.path);
        if (!result.ok) {
          toast.error(t(result.code));
          return;
        }

        setOverride({ url: result.data.avatarUrl });
      } catch {
        toast.error(t("profile.avatar.errors.uploadFailed"));
        return;
      }

      router.refresh();
      toast.success(hadAvatar ? t("profile.avatar.replaced") : t("profile.avatar.uploaded"));
    });
  }

  function handleRemove() {
    startRemove(async () => {
      const result = await removeAvatarAction();
      if (!result.ok) {
        toast.error(t(result.code));
        return;
      }

      setOverride({ url: null });
      setRemoveOpen(false);
      router.refresh();
      toast.success(t("profile.avatar.removed"));
    });
  }

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border/60 p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">{t("profile.avatar.previewTitle")}</h2>
        <p className="text-xs text-pretty text-muted-foreground">
          {t("profile.avatar.previewSubtitle")}
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <AvatarPreview src={previewUrl} alt={alt} />

        <div className="flex flex-col gap-3">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            disabled={busy}
            onChange={handleFileChange}
          />

          <Button type="button" className="h-10 w-fit" disabled={busy} onClick={openPicker}>
            {isUploading
              ? t("common.loading")
              : previewUrl
                ? t("profile.avatar.replace")
                : t("profile.avatar.upload")}
          </Button>

          {previewUrl ? (
            <Button
              type="button"
              variant="ghost"
              className="h-10 w-fit"
              disabled={busy}
              onClick={() => setRemoveOpen(true)}
            >
              {t("profile.avatar.remove")}
            </Button>
          ) : null}

          <p className="text-xs text-pretty text-muted-foreground">{t("profile.avatar.hint")}</p>
        </div>
      </div>

      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("profile.avatar.removeTitle")}</DialogTitle>
            <DialogDescription>{t("profile.avatar.removeBody")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={isRemoving}
              onClick={() => setRemoveOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isRemoving}
              onClick={handleRemove}
            >
              {isRemoving ? t("common.loading") : t("profile.avatar.removeConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
