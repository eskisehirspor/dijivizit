"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

import { createDocumentAction } from "@/app/actions/documents";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DOCUMENT_LIMIT,
  DOCUMENT_MIME_TYPE,
  DOCUMENT_TYPES,
  type DocumentType,
} from "@/lib/profile/documents";
import { cn } from "@/lib/utils";

export function DocumentForm({ documentCount }: { documentCount: number }) {
  const t = useTranslations();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Keep the real File in a ref — native form submission of a hidden file input
  // can arrive on the server as File { size: 0 }, which fails empty validation.
  const selectedFileRef = useRef<File | null>(null);
  const [type, setType] = useState<DocumentType>("cv");
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [isPending, startTransition] = useTransition();

  const atLimit = documentCount >= DOCUMENT_LIMIT;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    selectedFileRef.current = file;
    setFileName(file?.name ?? null);
    setErrorCode(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const file = selectedFileRef.current;
    if (!file) {
      setErrorCode("profile.documents.errors.empty");
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("file", file);

    startTransition(async () => {
      const result = await createDocumentAction(null, formData);
      if (!result.ok) {
        setErrorCode(result.code);
        setFieldErrors(result.fieldErrors ?? null);
        return;
      }

      selectedFileRef.current = null;
      setFileName(null);
      setType("cv");
      setErrorCode(null);
      setFieldErrors(null);
      setFormKey((key) => key + 1);
      router.refresh();
      toast.success(t("profile.documents.uploaded"));
    });
  }

  return (
    <form
      key={formKey}
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-lg border border-border/60 p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">{t("profile.documents.addTitle")}</h2>
        <p className="text-xs text-muted-foreground">{t("profile.documents.addSubtitle")}</p>
      </div>

      {errorCode && !fieldErrors ? (
        <Alert variant="destructive">
          <AlertDescription>{t(errorCode)}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="document-type" className="text-xs font-medium text-muted-foreground">
          {t("profile.documents.fields.type")}
        </Label>
        <select
          id="document-type"
          name="type"
          value={type}
          disabled={atLimit || isPending}
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
        {fieldErrors?.type ? (
          <p className="text-xs text-destructive">{t(fieldErrors.type)}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="document-title" className="text-xs font-medium text-muted-foreground">
          {t("profile.documents.fields.title")}
        </Label>
        <Input
          id="document-title"
          name="title"
          className="h-10"
          disabled={atLimit || isPending}
          aria-invalid={Boolean(fieldErrors?.title)}
        />
        {fieldErrors?.title ? (
          <p className="text-xs text-destructive">{t(fieldErrors.title)}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="document-description" className="text-xs font-medium text-muted-foreground">
          {t("profile.documents.fields.description")}
        </Label>
        <Textarea
          id="document-description"
          name="description"
          disabled={atLimit || isPending}
          aria-invalid={Boolean(fieldErrors?.description)}
        />
        <p className="text-xs text-muted-foreground">
          {t("profile.documents.fields.descriptionHint")}
        </p>
        {fieldErrors?.description ? (
          <p className="text-xs text-destructive">{t(fieldErrors.description)}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="document-file" className="text-xs font-medium text-muted-foreground">
          {t("profile.documents.fields.file")}
        </Label>
        <input
          ref={fileInputRef}
          id="document-file"
          type="file"
          accept={DOCUMENT_MIME_TYPE}
          className="sr-only"
          disabled={atLimit || isPending}
          onChange={handleFileChange}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-fit"
            disabled={atLimit || isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            {t("profile.documents.chooseFile")}
          </Button>
          <p className="text-sm text-muted-foreground">
            {fileName ?? t("profile.documents.noFileChosen")}
          </p>
        </div>
        <p className="text-xs text-pretty text-muted-foreground">{t("profile.documents.hint")}</p>
      </div>

      <Button type="submit" className="h-10 w-fit" disabled={atLimit || isPending || !fileName}>
        {isPending ? t("common.loading") : t("profile.documents.upload")}
      </Button>

      {atLimit ? (
        <p className="text-xs text-muted-foreground">
          {t("profile.documents.errors.limitReached")}
        </p>
      ) : null}
    </form>
  );
}
