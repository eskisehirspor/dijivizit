import { useTranslations } from "next-intl";

export default function PublicCardNotFound() {
  const t = useTranslations("card");

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex max-w-sm animate-rise flex-col items-center gap-3">
        <h1 className="text-xl font-semibold text-balance">{t("notFoundTitle")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("notFoundBody")}</p>
      </div>
    </div>
  );
}
