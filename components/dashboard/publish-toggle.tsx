"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { setProfilePublishedAction } from "@/app/actions/profile-publish";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function PublishToggle({ published }: { published: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [unpublishOpen, setUnpublishOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function applyPublished(next: boolean) {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("published", next ? "true" : "false");

      const result = await setProfilePublishedAction(formData);
      if (!result.ok) {
        toast.error(t(result.code));
        return;
      }

      setUnpublishOpen(false);
      router.refresh();
      toast.success(
        next ? t("dashboard.publish.publishedToast") : t("dashboard.publish.unpublishedToast"),
      );
    });
  }

  function handleCheckedChange(checked: boolean) {
    if (!checked && published) {
      setUnpublishOpen(true);
      return;
    }
    applyPublished(checked);
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="publish-toggle" className="text-sm font-medium">
            {t("dashboard.publish.label")}
          </Label>
          <p className="text-xs text-pretty text-muted-foreground">
            {published
              ? t("dashboard.publish.descriptionPublished")
              : t("dashboard.publish.descriptionDraft")}
          </p>
        </div>
        <Switch
          id="publish-toggle"
          checked={published}
          disabled={isPending}
          onCheckedChange={handleCheckedChange}
          aria-label={t("dashboard.publish.label")}
        />
      </div>

      <Dialog open={unpublishOpen} onOpenChange={setUnpublishOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("dashboard.publish.unpublishTitle")}</DialogTitle>
            <DialogDescription>{t("dashboard.publish.unpublishBody")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => setUnpublishOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={() => applyPublished(false)}
            >
              {isPending ? t("common.loading") : t("dashboard.publish.unpublishConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
