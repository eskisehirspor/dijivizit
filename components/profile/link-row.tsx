"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  deleteProfileLinkAction,
  moveProfileLinkAction,
  toggleProfileLinkVisibilityAction,
  updateProfileLinkAction,
} from "@/app/actions/profile-links";
import { LinkValueField } from "@/components/profile/link-value-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import type { ActionResult } from "@/lib/action-result";
import type { OwnProfileLink } from "@/lib/dal/profile-links";
import { isMvpLinkPlatform } from "@/lib/profile/platforms";

export function LinkRow({
  link,
  isFirst,
  isLast,
}: {
  link: OwnProfileLink;
  isFirst: boolean;
  isLast: boolean;
}) {
  const t = useTranslations();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isMoving, startMove] = useTransition();
  const [isToggling, startToggle] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    updateProfileLinkAction,
    null,
  );
  const [acknowledgedSuccess, setAcknowledgedSuccess] = useState<ActionResult | null>(null);

  if (state?.ok && state !== acknowledgedSuccess) {
    setAcknowledgedSuccess(state);
  }

  useEffect(() => {
    if (!acknowledgedSuccess?.ok) {
      return;
    }
    toast.success(t("profile.links.updated"));
  }, [acknowledgedSuccess, t]);

  const failed = state && !state.ok ? state : null;
  const platformLabel = isMvpLinkPlatform(link.platform)
    ? t(`profile.links.platforms.${link.platform}`)
    : link.platform;

  function handleVisibility(checked: boolean) {
    startToggle(async () => {
      const result = await toggleProfileLinkVisibilityAction(link.id, checked);
      if (!result.ok) {
        toast.error(t(result.code));
      }
    });
  }

  function handleMove(direction: "up" | "down") {
    startMove(async () => {
      const result = await moveProfileLinkAction(link.id, direction);
      if (!result.ok) {
        toast.error(t(result.code));
      }
    });
  }

  function handleDelete() {
    startDelete(async () => {
      const result = await deleteProfileLinkAction(link.id);
      if (!result.ok) {
        toast.error(t(result.code));
        return;
      }
      setDeleteOpen(false);
      toast.success(t("profile.links.deleted"));
    });
  }

  return (
    <li className="grid gap-5 rounded-lg border border-border/60 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium">{platformLabel}</p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isFirst || isMoving}
            onClick={() => handleMove("up")}
            aria-label={t("profile.links.moveUp")}
          >
            <ArrowUp />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isLast || isMoving}
            onClick={() => handleMove("down")}
            aria-label={t("profile.links.moveDown")}
          >
            <ArrowDown />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setDeleteOpen(true)}
            aria-label={t("profile.links.delete")}
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <form action={formAction} className="grid gap-5">
        <input type="hidden" name="id" value={link.id} />

        {failed && !failed.fieldErrors ? (
          <Alert variant="destructive">
            <AlertDescription>{t(failed.code)}</AlertDescription>
          </Alert>
        ) : null}

        <LinkValueField
          platform={link.platform}
          defaultValue={link.value}
          required
          error={failed?.fieldErrors?.value ? t(failed.fieldErrors.value) : undefined}
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Switch
              id={`visible-${link.id}`}
              checked={link.is_visible}
              disabled={isToggling}
              onCheckedChange={handleVisibility}
            />
            <Label htmlFor={`visible-${link.id}`} className="text-sm font-normal">
              {t("profile.links.visible")}
            </Label>
          </div>

          <Button type="submit" variant="outline" className="h-10" disabled={isPending}>
            {isPending ? t("common.loading") : t("common.save")}
          </Button>
        </div>
      </form>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("profile.links.deleteTitle")}</DialogTitle>
            <DialogDescription>{t("profile.links.deleteBody")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={isDeleting}
              onClick={() => setDeleteOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? t("common.loading") : t("profile.links.deleteConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
}
