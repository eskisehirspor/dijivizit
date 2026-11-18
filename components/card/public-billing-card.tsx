import { Receipt } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { Locale } from "@/lib/i18n/config";

import { InfoCard } from "@/components/card/info-card";

export async function PublicBillingCard({
  companyTitle,
  companyAddress,
  taxNumber,
  taxOffice,
  locale = "tr",
}: {
  companyTitle: string;
  companyAddress: string;
  taxNumber: string;
  taxOffice: string;
  locale?: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "card.billing" });

  return (
    <InfoCard
      icon={<Receipt aria-hidden="true" className="size-4" strokeWidth={1.75} />}
      title={t("title")}
      rows={[
        {
          label: t("companyTitle"),
          value: companyTitle,
          valueClassName: "font-medium",
          copy: { value: companyTitle, label: t("copyCompanyTitle") },
        },
        {
          label: t("companyAddress"),
          value: companyAddress,
          valueClassName: "whitespace-pre-line",
          copy: { value: companyAddress, label: t("copyCompanyAddress") },
        },
        {
          label: t("taxNumber"),
          value: taxNumber,
          valueClassName: "font-mono break-all",
          copy: { value: taxNumber, label: t("copyTaxNumber") },
        },
        {
          label: t("taxOffice"),
          value: taxOffice,
        },
      ]}
    />
  );
}
