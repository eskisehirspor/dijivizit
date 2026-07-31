"use client";

import { Copy, Mail, MessageCircle, QrCode, Send, Share } from "lucide-react";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { trackAnalyticsEventAction } from "@/app/actions/analytics";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getOrCreateVisitorId } from "@/lib/analytics/visitor-id";
import {
  emailShareHref,
  telegramShareHref,
  whatsappShareHref,
} from "@/lib/share/public-share-links";
import type { AnalyticsEventType } from "@/lib/validations/analytics";
import { cn } from "@/lib/utils";

const QR_PREVIEW_SIZE = 280;
const QR_EXPORT_SIZE = 1024;

type PublicShareMenuProps = {
  publicId: string;
  publicUrl: string;
};

export function PublicShareMenu({ publicId, publicUrl }: PublicShareMenuProps) {
  const t = useTranslations("card.share");
  const [menuOpen, setMenuOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrPreview, setQrPreview] = useState<string | null>(null);

  function track(eventType: AnalyticsEventType) {
    void trackAnalyticsEventAction({
      publicId,
      eventType,
      visitorId: getOrCreateVisitorId(),
    });
  }

  useEffect(() => {
    if (!qrOpen) {
      return;
    }

    let cancelled = false;

    void QRCode.toDataURL(publicUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: QR_PREVIEW_SIZE,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    }).then((dataUrl) => {
      if (!cancelled) {
        setQrPreview(dataUrl);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [publicUrl, qrOpen]);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      track("copy_link");
      toast.success(t("copied"));
      setMenuOpen(false);
    } catch {
      toast.error(t("copyFailed"));
    }
  }

  async function downloadPng() {
    try {
      const dataUrl = await QRCode.toDataURL(publicUrl, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: QR_EXPORT_SIZE,
        color: { dark: "#0a0a0a", light: "#ffffff" },
      });
      const anchor = document.createElement("a");
      anchor.href = dataUrl;
      anchor.download = "dijivizit-qr.png";
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch {
      toast.error(t("qr.downloadFailed"));
    }
  }

  return (
    <>
      <Popover
        open={menuOpen}
        onOpenChange={(next) => {
          setMenuOpen(next);
          if (next) {
            track("share");
          }
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={t("trigger")}
            className={cn(
              "flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors",
              "hover:text-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
              "aria-expanded:text-foreground",
            )}
          >
            <Share aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={8} className="w-56 gap-0 p-1.5 shadow-xs">
          <ul className="flex flex-col">
            <li>
              <ShareMenuLink
                href={whatsappShareHref(publicUrl)}
                icon={<MessageCircle aria-hidden="true" className="size-4" strokeWidth={1.75} />}
                label={t("whatsapp")}
              />
            </li>
            <li>
              <ShareMenuLink
                href={telegramShareHref(publicUrl)}
                icon={<Send aria-hidden="true" className="size-4" strokeWidth={1.75} />}
                label={t("telegram")}
              />
            </li>
            <li>
              <ShareMenuLink
                href={emailShareHref(publicUrl, t("emailSubject"))}
                icon={<Mail aria-hidden="true" className="size-4" strokeWidth={1.75} />}
                label={t("email")}
              />
            </li>
            <li>
              <ShareMenuButton
                onClick={handleCopyLink}
                icon={<Copy aria-hidden="true" className="size-4" strokeWidth={1.75} />}
                label={t("copyLink")}
              />
            </li>
            <li>
              <ShareMenuButton
                onClick={() => {
                  setMenuOpen(false);
                  setQrOpen(true);
                  track("qr_open");
                }}
                icon={<QrCode aria-hidden="true" className="size-4" strokeWidth={1.75} />}
                label={t("qrCode")}
              />
            </li>
          </ul>
        </PopoverContent>
      </Popover>

      <Dialog
        open={qrOpen}
        onOpenChange={(next) => {
          setQrOpen(next);
          if (!next) {
            setQrPreview(null);
          }
        }}
      >
        <DialogContent
          // The QR block makes this the tallest dialog in the app; without a cap
          // it runs off-screen on phones held in landscape.
          className="max-h-[90dvh] overflow-y-auto sm:max-w-sm"
        >
          <DialogHeader>
            <DialogTitle>{t("qr.title")}</DialogTitle>
            <DialogDescription>{t("qr.description")}</DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-2">
            <div className="flex aspect-square w-full max-w-[280px] items-center justify-center rounded-lg border border-border/60 bg-white p-3">
              {qrPreview ? (
                // eslint-disable-next-line @next/next/no-img-element -- QR data URL preview
                <img
                  src={qrPreview}
                  alt={t("qr.previewLabel")}
                  width={QR_PREVIEW_SIZE}
                  height={QR_PREVIEW_SIZE}
                  className="size-full"
                />
              ) : (
                <div
                  className="size-full animate-pulse rounded-md bg-muted/60"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>

          <Button type="button" className="h-10 w-full" onClick={downloadPng} disabled={!qrPreview}>
            {t("qr.downloadPng")}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ShareMenuLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  // mailto: handed to a new tab leaves an orphaned blank tab behind once the
  // mail client takes over, so only web share targets get _blank.
  const external = /^https?:/i.test(href);

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={shareMenuItemClassName}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span>{label}</span>
    </a>
  );
}

function ShareMenuButton({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button type="button" onClick={onClick} className={shareMenuItemClassName}>
      <span className="text-muted-foreground">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

const shareMenuItemClassName = cn(
  "flex min-h-11 w-full items-center gap-3 rounded-md px-2.5 py-3 text-left text-sm transition-colors",
  "hover:bg-muted/60",
  "focus-visible:bg-muted/60 focus-visible:outline-none",
);
