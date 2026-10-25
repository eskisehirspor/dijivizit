"use client";

import { Camera, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { scanCardAction } from "@/app/actions/scan-card";
import { ContactForm, type ContactFormValues } from "@/components/contacts/contact-form";
import { Button } from "@/components/ui/button";

/** Downscale on the device so the upload stays small and fast. */
async function toJpegDataUrl(file: File, maxSide = 1400): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  let quality = 0.82;
  let url = canvas.toDataURL("image/jpeg", quality);
  while (url.length > 900_000 && quality > 0.4) {
    quality -= 0.12;
    url = canvas.toDataURL("image/jpeg", quality);
  }
  return url;
}

export function ScanCard() {
  const t = useTranslations("scan");
  const tRoot = useTranslations();
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<ContactFormValues | null>(null);
  const [round, setRound] = useState(0);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setValues(null);
    setBusy(true);
    try {
      const dataUrl = await toJpegDataUrl(file);
      setPreview(dataUrl);
      const result = await scanCardAction(dataUrl);
      if (!result.ok) {
        setError(tRoot(result.code as never));
        return;
      }
      setValues({
        fullName: result.data.fullName,
        phone: result.data.phone || null,
        email: result.data.email || null,
        company: result.data.company || null,
        title: result.data.title || null,
        metWhere: null,
        tags: [],
      });
      setRound((n) => n + 1);
    } catch {
      setError(t("errors.image"));
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-4 rounded-lg border border-dashed border-border p-6">
        <input
          ref={input}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">{t("pickTitle")}</p>
          <p className="text-xs text-pretty text-muted-foreground">{t("pickBody")}</p>
        </div>
        <Button
          type="button"
          className="h-11"
          disabled={busy}
          onClick={() => input.current?.click()}
        >
          {busy ? (
            <Loader2 aria-hidden="true" className="animate-spin" />
          ) : (
            <Camera aria-hidden="true" />
          )}
          {busy ? t("reading") : values ? t("again") : t("pick")}
        </Button>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local preview of the photo
          <img
            src={preview}
            alt={t("previewAlt")}
            className="max-h-56 w-auto rounded-md border border-border/60"
          />
        ) : null}
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">{t("privacy")}</p>
      </div>

      {values ? (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-medium">{t("checkTitle")}</h2>
            <p className="text-xs text-muted-foreground">{t("checkBody")}</p>
          </div>
          <ContactForm key={round} values={values} />
        </section>
      ) : null}
    </div>
  );
}
