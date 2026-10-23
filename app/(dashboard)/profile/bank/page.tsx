import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CardVisibilityToggle } from "@/components/profile/card-visibility-toggle";
import { BankAccountForm } from "@/components/profile/bank-account-form";
import { getOwnBankAccount } from "@/lib/dal/bank-accounts";
import { formatIbanDisplay } from "@/lib/bank/turkish-iban";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("profile.bank");
  return { title: t("title") };
}

export default async function ProfileBankPage() {
  const [t, account] = await Promise.all([getTranslations("profile.bank"), getOwnBankAccount()]);

  return (
    <div className="flex animate-rise flex-col gap-12">
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

      {account ? <CardVisibilityToggle kind="bank" visible={account.is_visible} /> : null}

      <BankAccountForm
        hasExisting={Boolean(account)}
        defaults={{
          accountHolder: account?.account_holder ?? "",
          iban: account ? formatIbanDisplay(account.iban) : "",
          bankName: account?.bank_name ?? "",
        }}
      />
    </div>
  );
}
