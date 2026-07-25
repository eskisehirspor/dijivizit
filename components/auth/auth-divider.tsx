import { useTranslations } from "next-intl";

export function AuthDivider() {
  const t = useTranslations("auth");

  return (
    <div className="flex items-center gap-4" role="separator">
      <span className="h-px flex-1 bg-border" />
      <span className="text-[0.6875rem] tracking-wider text-muted-foreground uppercase">
        {t("divider")}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
