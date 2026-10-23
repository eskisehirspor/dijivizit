import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { DeleteAccount } from "@/components/settings/delete-account";
import { EmailForm } from "@/components/settings/email-form";
import { PasswordForm } from "@/components/settings/password-form";
import { getOwnAccount } from "@/lib/dal/account";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("settings");
  return { title: t("title") };
}

export default async function SettingsPage() {
  const [t, account] = await Promise.all([getTranslations("settings"), getOwnAccount()]);

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

      <section className="flex flex-col gap-6 rounded-lg border border-border/60 p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium">{t("email.title")}</h2>
          <p className="text-sm text-pretty break-all text-muted-foreground">
            {t("email.current", { email: account.email ?? "—" })}
          </p>
          {account.pendingEmail ? (
            <p className="text-xs text-pretty text-muted-foreground">
              {t("email.pending", { email: account.pendingEmail })}
            </p>
          ) : null}
        </div>
        <EmailForm />
      </section>

      <section className="flex flex-col gap-6 rounded-lg border border-border/60 p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium">
            {account.hasPassword ? t("password.title") : t("password.setTitle")}
          </h2>
          {!account.hasPassword ? (
            <p className="text-xs text-pretty text-muted-foreground">{t("password.googleHint")}</p>
          ) : null}
        </div>
        <PasswordForm hasPassword={account.hasPassword} />
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-destructive/30 p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium">{t("delete.title")}</h2>
          <p className="text-sm text-pretty text-muted-foreground">{t("delete.body")}</p>
        </div>
        <DeleteAccount />
      </section>
    </div>
  );
}
