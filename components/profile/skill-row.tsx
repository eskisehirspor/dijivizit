"use client";

import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  deleteProfileSkillAction,
  moveProfileSkillAction,
  updateProfileSkillAction,
} from "@/app/actions/profile-skills";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import type { ActionResult } from "@/lib/action-result";
import type { OwnProfileSkill } from "@/lib/dal/profile-skills";
import { PROFILE_SKILL_TYPES } from "@/lib/profile/skill-types";
import { cn } from "@/lib/utils";

export function SkillRow({
  skill,
  isFirst,
  isLast,
}: {
  skill: OwnProfileSkill;
  isFirst: boolean;
  isLast: boolean;
}) {
  const t = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [editKey, setEditKey] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isMoving, startMove] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  function openEdit() {
    setEditKey((key) => key + 1);
    setIsEditing(true);
  }

  function closeEdit() {
    setIsEditing(false);
  }

  function handleMove(direction: "up" | "down") {
    startMove(async () => {
      const result = await moveProfileSkillAction(skill.id, direction);
      if (!result.ok) {
        toast.error(t(result.code));
      }
    });
  }

  function handleDelete() {
    startDelete(async () => {
      const result = await deleteProfileSkillAction(skill.id);
      if (!result.ok) {
        toast.error(t(result.code));
        return;
      }
      setDeleteOpen(false);
      toast.success(t("profile.skills.deleted"));
    });
  }

  return (
    <li className="rounded-lg border border-border/60 p-4">
      {isEditing ? (
        <SkillEditForm key={editKey} skill={skill} onCancel={closeEdit} onSaved={closeEdit} />
      ) : (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1.5">
            <Badge variant="outline">{t(`profile.skills.types.${skill.type}`)}</Badge>
            <p className="text-sm font-medium text-pretty">{skill.name}</p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={isFirst || isMoving}
              onClick={() => handleMove("up")}
              aria-label={t("profile.skills.moveUp")}
            >
              <ArrowUp />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={isLast || isMoving}
              onClick={() => handleMove("down")}
              aria-label={t("profile.skills.moveDown")}
            >
              <ArrowDown />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={openEdit}
              aria-label={t("profile.skills.edit")}
            >
              <Pencil />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setDeleteOpen(true)}
              aria-label={t("profile.skills.delete")}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("profile.skills.deleteTitle")}</DialogTitle>
            <DialogDescription>{t("profile.skills.deleteBody")}</DialogDescription>
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
              {isDeleting ? t("common.loading") : t("profile.skills.deleteConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
}

function SkillEditForm({
  skill,
  onCancel,
  onSaved,
}: {
  skill: OwnProfileSkill;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const t = useTranslations();
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    updateProfileSkillAction,
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
    toast.success(t("profile.skills.updated"));
    onSaved();
  }, [acknowledgedSuccess, onSaved, t]);

  const failed = state && !state.ok ? state : null;

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="id" value={skill.id} />

      {failed && !failed.fieldErrors ? (
        <Alert variant="destructive">
          <AlertDescription>{t(failed.code)}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-2">
        <Label
          htmlFor={`skill-type-${skill.id}`}
          className="text-xs font-medium text-muted-foreground"
        >
          {t("profile.skills.fields.type")}
        </Label>
        <select
          id={`skill-type-${skill.id}`}
          name="type"
          defaultValue={skill.type}
          disabled={isPending}
          className={cn(
            "h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {PROFILE_SKILL_TYPES.map((item) => (
            <option key={item} value={item}>
              {t(`profile.skills.types.${item}`)}
            </option>
          ))}
        </select>
        {failed?.fieldErrors?.type ? (
          <p className="text-xs text-destructive">{t(failed.fieldErrors.type)}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label
          htmlFor={`skill-name-${skill.id}`}
          className="text-xs font-medium text-muted-foreground"
        >
          {t("profile.skills.fields.name")}
        </Label>
        <Input
          id={`skill-name-${skill.id}`}
          name="name"
          required
          maxLength={60}
          defaultValue={skill.name}
          disabled={isPending}
          aria-invalid={failed?.fieldErrors?.name ? true : undefined}
        />
        {failed?.fieldErrors?.name ? (
          <p className="text-xs text-destructive">{t(failed.fieldErrors.name)}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" className="h-10" disabled={isPending}>
          {isPending ? t("common.loading") : t("common.save")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-10"
          disabled={isPending}
          onClick={onCancel}
        >
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
}
