import { Building2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { InfoCard } from "@/components/card/info-card";
import { formatIbanDisplay } from "@/lib/bank/turkish-iban";

export async function PublicBankCard({
  accountHolder,
  iban,
  bankName,
}: {
  accountHolder: string;
  iban: string;
  bankName: string;
}) {
  const t = await getTranslations("card.bank");

  return (
    <InfoCard
      icon={<Building2 aria-hidden="true" className="size-4" strokeWidth={1.75} />}
      title={t("title")}
      rows={[
        {
          label: t("accountHolder"),
          value: accountHolder,
          valueClassName: "font-medium",
          copy: { value: accountHolder, label: t("copyAccountHolder") },
        },
        {
          label: t("iban"),
          value: formatIbanDisplay(iban),
          valueClassName: "font-mono break-all",
          copy: { value: iban, label: t("copyIban") },
        },
        {
          label: t("bankName"),
          value: bankName,
        },
      ]}
    />
  );
}
