"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  deleteDocumentAction,
  toggleDocumentVisibilityAction,
  updateDocumentAction,
} from "@/app/actions/documents";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/action-result";
import type { OwnDocument } from "@/lib/dal/documents";
import {
  DOCUMENT_TYPES,
  formatFileSize,
  isDocumentType,
  type DocumentType,
} from "@/lib/profile/documents";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function DocumentRow({ document }: { document: OwnDocument }) {
  const t = useTranslations();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [type, setType] = useState<DocumentType>(
    isDocumentType(document.type) ? document.type : "other",
  );
  const [isToggling, startToggle] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    updateDocumentAction,
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
    toast.success(t("profile.documents.updated"));
  }, [acknowledgedSuccess, t]);

  const failed = state && !state.ok ? state : null;

  const uploadedLabel = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(document.updated_at));

  function handleVisibility(checked: boolean) {
    startToggle(async () => {
      const result = await toggleDocumentVisibilityAction(document.id, checked);
      if (!result.ok) {
        toast.error(t(result.code));
      }
    });
  }

  function handleDelete() {
    startDelete(async () => {
      const result = await deleteDocumentAction(document.id);
      if (!result.ok) {
        toast.error(t(result.code));
        return;
      }
      setDeleteOpen(false);
      toast.success(t("profile.documents.deleted"));
    });
  }

  return (
    <li className="grid gap-5 rounded-lg border border-border/60 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{document.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatFileSize(document.file_size)} · {uploadedLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id={`document-visible-${document.id}`}
            checked={document.is_visible}
            disabled={isToggling || isDeleting || isPending}
            onCheckedChange={handleVisibility}
            aria-label={t("profile.documents.fields.visible")}
          />
          <Label
            htmlFor={`document-visible-${document.id}`}
            className="text-xs text-muted-foreground"
          >
            {document.is_visible ? t("profile.documents.visible") : t("profile.documents.hidden")}
          </Label>
        </div>
      </div>

      <form action={formAction} className="grid gap-5">
        <input type="hidden" name="id" value={document.id} />

        {failed && !failed.fieldErrors ? (
          <Alert variant="destructive">
            <AlertDescription>{t(failed.code)}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-2">
          <Label
            htmlFor={`document-type-${document.id}`}
            className="text-xs font-medium text-muted-foreground"
          >
            {t("profile.documents.fields.type")}
          </Label>
          <select
            id={`document-type-${document.id}`}
            name="type"
            value={type}
            disabled={isPending || isDeleting}
            onChange={(event) => setType(event.target.value as DocumentType)}
            className={cn(
              "h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {DOCUMENT_TYPES.map((item) => (
              <option key={item} value={item}>
                {t(`profile.documents.types.${item}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor={`document-title-${document.id}`}
            className="text-xs font-medium text-muted-foreground"
          >
            {t("profile.documents.fields.title")}
          </Label>
          <Input
            id={`document-title-${document.id}`}
            name="title"
            className="h-10"
            defaultValue={document.title}
            disabled={isPending || isDeleting}
            aria-invalid={Boolean(failed?.fieldErrors?.title)}
          />
          {failed?.fieldErrors?.title ? (
            <p className="text-xs text-destructive">{t(failed.fieldErrors.title)}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor={`document-description-${document.id}`}
            className="text-xs font-medium text-muted-foreground"
          >
            {t("profile.documents.fields.description")}
          </Label>
          <Textarea
            id={`document-description-${document.id}`}
            name="description"
            defaultValue={document.description ?? ""}
            disabled={isPending || isDeleting}
            aria-invalid={Boolean(failed?.fieldErrors?.description)}
          />
          {failed?.fieldErrors?.description ? (
            <p className="text-xs text-destructive">{t(failed.fieldErrors.description)}</p>
          ) : null}
        </div>

        <p className="truncate text-xs text-muted-foreground">{document.file_name}</p>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" className="h-10 w-fit" disabled={isPending || isDeleting}>
            {isPending ? t("common.loading") : t("profile.documents.save")}
          </Button>
          <Button asChild variant="outline" className="h-10 w-fit" disabled={isDeleting}>
            <a
              href={routes.profileDocumentFile(document.id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("profile.documents.view")}
            </a>
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-10 w-fit"
            disabled={isDeleting || isPending}
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 aria-hidden="true" className="size-4" />
            {t("profile.documents.delete")}
          </Button>
        </div>
      </form>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("profile.documents.deleteTitle")}</DialogTitle>
            <DialogDescription>{t("profile.documents.deleteBody")}</DialogDescription>
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
              {isDeleting ? t("common.loading") : t("profile.documents.deleteConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
}
