"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteCvAction, uploadCvAction } from "@/app/actions/document-cv";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatFileSize, CV_MIME_TYPE } from "@/lib/profile/documents";
import { routes } from "@/lib/routes";

export type CvManagerDocument = {
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  viewUrl: string;
};

export function CvManager({ document }: { document: CvManagerDocument | null }) {
  const t = useTranslations();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useState(document);
  const [propSnapshot, setPropSnapshot] = useState(document);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [isUploading, startUpload] = useTransition();
  const [isRemoving, startRemove] = useTransition();

  if (document !== propSnapshot) {
    setPropSnapshot(document);
    setCurrent(document);
  }

  const busy = isUploading || isRemoving;

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.set("cv", file);
    const hadCv = Boolean(current);

    startUpload(async () => {
      const result = await uploadCvAction(formData);
      if (!result.ok) {
        toast.error(t(result.code));
        return;
      }

      const next = result.data.document;
      if (next) {
        setCurrent({
          fileName: next.file_name,
          fileSize: next.file_size,
          uploadedAt: next.updated_at,
          viewUrl: routes.profileCvFile,
        });
      }
      router.refresh();
      toast.success(hadCv ? t("profile.cv.replaced") : t("profile.cv.uploaded"));
    });
  }

  function handleRemove() {
    startRemove(async () => {
      const result = await deleteCvAction();
      if (!result.ok) {
        toast.error(t(result.code));
        return;
      }

      setCurrent(null);
      setPropSnapshot(null);
      setRemoveOpen(false);
      router.refresh();
      toast.success(t("profile.cv.deleted"));
    });
  }

  const uploadedLabel = current
    ? new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(current.uploadedAt))
    : null;

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border/60 p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">{t("profile.cv.previewTitle")}</h2>
        <p className="text-xs text-pretty text-muted-foreground">
          {t("profile.cv.previewSubtitle")}
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex size-24 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted text-muted-foreground">
          <span className="text-xs font-medium tracking-wide">PDF</span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <input
            ref={inputRef}
            type="file"
            accept={CV_MIME_TYPE}
            className="sr-only"
            disabled={busy}
            onChange={handleFileChange}
          />

          {current ? (
            <div className="flex flex-col gap-1.5">
              <p className="truncate text-sm font-medium">{current.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(current.fileSize)}
                {uploadedLabel ? ` · ${uploadedLabel}` : null}
              </p>
            </div>
          ) : (
            <p className="text-sm text-pretty text-muted-foreground">{t("profile.cv.empty")}</p>
          )}

          <div className="flex flex-col gap-3">
            {current ? (
              <Button asChild className="h-10 w-fit" disabled={busy}>
                <a href={current.viewUrl} target="_blank" rel="noopener noreferrer">
                  {t("profile.cv.view")}
                </a>
              </Button>
            ) : null}

            <Button
              type="button"
              variant={current ? "outline" : "default"}
              className="h-10 w-fit"
              disabled={busy}
              onClick={openPicker}
            >
              {isUploading
                ? t("common.loading")
                : current
                  ? t("profile.cv.replace")
                  : t("profile.cv.upload")}
            </Button>

            {current ? (
              <Button
                type="button"
                variant="ghost"
                className="h-10 w-fit"
                disabled={busy}
                onClick={() => setRemoveOpen(true)}
              >
                {t("profile.cv.delete")}
              </Button>
            ) : null}

            <p className="text-xs text-pretty text-muted-foreground">{t("profile.cv.hint")}</p>
          </div>
        </div>
      </div>

      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("profile.cv.deleteTitle")}</DialogTitle>
            <DialogDescription>{t("profile.cv.deleteBody")}</DialogDescription>
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
              {isRemoving ? t("common.loading") : t("profile.cv.deleteConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
