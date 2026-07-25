import { Globe, Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

function ActionDot({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground">
      {children}
    </span>
  );
}

/**
 * A static rendering of the product itself, mirroring the public card layout.
 * Exposed as a single labelled image so assistive tech announces it as an
 * example rather than reading fictional contact details as real ones.
 */
export function CardPreview() {
  const t = useTranslations("marketing.preview");

  return (
    <div
      role="img"
      aria-label={t("label")}
      /* Three stacked shadows — contact, mid, and ambient — read as a physical
         object; a single blur reads as a UI panel. The inset top highlight only
         registers against a non-white surface, so it is dark-mode only. */
      className="mx-auto flex w-full max-w-[20.5rem] flex-col items-center rounded-[1.375rem] border border-border/60 bg-card px-8 py-11 text-center shadow-[0_1px_1px_0_rgb(0_0_0/0.04),0_8px_16px_-6px_rgb(0_0_0/0.06),0_28px_56px_-20px_rgb(0_0_0/0.16)] dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06),0_28px_56px_-24px_rgb(0_0_0/0.7)]"
    >
      <span className="flex size-[4.5rem] items-center justify-center rounded-full bg-secondary text-base font-medium tracking-wide text-secondary-foreground ring-1 ring-border/60">
        {t("initials")}
      </span>

      <div className="mt-6 flex flex-col gap-1.5">
        <p className="text-[1.0625rem] leading-tight font-medium tracking-tight">{t("name")}</p>
        <p className="text-sm text-muted-foreground">
          {t("role")} · {t("company")}
        </p>
      </div>

      <div className="mt-7 flex items-center gap-2.5">
        <ActionDot>
          <Phone className="size-4" strokeWidth={1.75} />
        </ActionDot>
        <ActionDot>
          <Mail className="size-4" strokeWidth={1.75} />
        </ActionDot>
        <ActionDot>
          <Globe className="size-4" strokeWidth={1.75} />
        </ActionDot>
      </div>

      <div className="mt-8 h-px w-full bg-border/60" />

      <p className="mt-4 font-mono text-[0.6875rem] tracking-tight text-muted-foreground/80">
        {t("url")}
      </p>
    </div>
  );
}
