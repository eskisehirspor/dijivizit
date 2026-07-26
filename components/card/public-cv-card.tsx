import { FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { InfoCard } from "@/components/card/info-card";
import { Button } from "@/components/ui/button";

export async function PublicCvCard({ viewHref }: { viewHref: string }) {
  const t = await getTranslations("card.cv");

  return (
    <InfoCard
      icon={<FileText aria-hidden="true" className="size-4" strokeWidth={1.75} />}
      title={t("title")}
      rows={[
        {
          label: t("documentLabel"),
          value: t("pdfDocument"),
          valueClassName: "font-medium",
        },
      ]}
      action={
        <Button asChild className="h-10 w-full">
          <a href={viewHref} target="_blank" rel="noopener noreferrer">
            {t("view")}
          </a>
        </Button>
      }
    />
  );
}
