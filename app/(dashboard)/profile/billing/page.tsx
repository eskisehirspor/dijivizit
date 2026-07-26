import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { BillingInfoForm } from "@/components/profile/billing-info-form";
import { getOwnBillingInfo } from "@/lib/dal/billing-infos";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("profile.billing");
  return { title: t("title") };
}

export default async function ProfileBillingPage() {
  const [t, info] = await Promise.all([getTranslations("profile.billing"), getOwnBillingInfo()]);

  return (
    <div className="flex animate-rise flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t("title")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("subtitle")}</p>
        <p className="pt-3">
          <Link
            href={routes.dashboard}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("backToDashboard")}
          </Link>
        </p>
      </div>

      <BillingInfoForm
        hasExisting={Boolean(info)}
        defaults={{
          companyTitle: info?.company_title ?? "",
          companyAddress: info?.company_address ?? "",
          taxNumber: info?.tax_number ?? "",
          taxOffice: info?.tax_office ?? "",
        }}
      />
    </div>
  );
}
