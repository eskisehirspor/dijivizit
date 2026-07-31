"use client";

import { useTranslations } from "next-intl";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const QR_PREVIEW_SIZE = 220;
const QR_EXPORT_SIZE = 1024;

function triggerDownload(filename: string, href: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function ShareQrCode({ url }: { url: string }) {
  const t = useTranslations("dashboard.share.qr");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: QR_PREVIEW_SIZE,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    }).then((dataUrl) => {
      if (!cancelled) setPreview(dataUrl);
    });

    return () => {
      cancelled = true;
    };
  }, [url]);

  async function downloadPng() {
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: QR_EXPORT_SIZE,
        color: { dark: "#0a0a0a", light: "#ffffff" },
      });
      triggerDownload("dijivizit-qr.png", dataUrl);
    } catch {
      toast.error(t("errors.failed"));
    }
  }

  async function downloadSvg() {
    try {
      const svg = await QRCode.toString(url, {
        type: "svg",
        errorCorrectionLevel: "H",
        margin: 2,
        width: QR_EXPORT_SIZE,
        color: { dark: "#0a0a0a", light: "#ffffff" },
      });
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const objectUrl = URL.createObjectURL(blob);
      triggerDownload("dijivizit-qr.svg", objectUrl);
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
    } catch {
      toast.error(t("errors.failed"));
    }
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div
        className="flex size-[220px] items-center justify-center rounded-lg border border-border/60 bg-white p-3"
        aria-busy={!preview}
        aria-live="polite"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- QR data URL preview
          <img
            src={preview}
            alt={t("previewLabel")}
            width={QR_PREVIEW_SIZE}
            height={QR_PREVIEW_SIZE}
          />
        ) : (
          <div className="size-full animate-pulse rounded-md bg-muted/60" aria-hidden="true" />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" onClick={downloadPng} disabled={!preview}>
          {t("downloadPng")}
        </Button>
        <Button type="button" variant="outline" onClick={downloadSvg} disabled={!preview}>
          {t("downloadSvg")}
        </Button>
      </div>
    </div>
  );
}
