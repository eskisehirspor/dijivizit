"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteAccountAction } from "@/app/actions/account";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function DeleteAccount() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [isPending, startTransition] = useTransition();

  const confirmed = confirmation.trim().toLocaleUpperCase("tr-TR") === "SİL";

  function handleDelete() {
    startTransition(async () => {
      // On success the action redirects, so only failures come back here.
      const result = await deleteAccountAction(confirmation);
      if (result && !result.ok) {
        toast.error(t(result.code));
      }
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        className="h-10 w-fit"
        onClick={() => setOpen(true)}
      >
        {t("settings.delete.open")}
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!isPending) {
            setOpen(next);
            setConfirmation("");
          }
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("settings.delete.dialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("settings.delete.body")} {t("settings.delete.dialogBody")}
            </DialogDescription>
          </DialogHeader>
          <Input
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder={t("settings.delete.placeholder")}
            aria-label={t("settings.delete.dialogBody")}
            autoComplete="off"
            className="h-10"
            disabled={isPending}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!confirmed || isPending}
              onClick={handleDelete}
            >
              {isPending ? t("common.loading") : t("settings.delete.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
