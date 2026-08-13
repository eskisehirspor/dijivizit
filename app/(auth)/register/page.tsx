import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { AuthDivider } from "@/components/auth/auth-divider";
import { GoogleButton } from "@/components/auth/google-button";
import { RegisterForm } from "@/components/auth/register-form";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("auth.register");
  return { title: t("title") };
}

export default async function RegisterPage() {
  const t = await getTranslations();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-balance">{t("auth.register.title")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("auth.register.subtitle")}</p>
        <p className="text-sm text-pretty text-muted-foreground">{t("auth.register.inviteHint")}</p>
      </div>

      <div className="flex flex-col gap-5">
        <GoogleButton />
        <p className="text-xs text-pretty text-muted-foreground">{t("auth.register.googleHint")}</p>
        <AuthDivider />
        <RegisterForm />
      </div>

      <p className="text-sm text-muted-foreground">
        {t("auth.register.hasAccount")}{" "}
        <Link
          href={routes.login}
          className="text-foreground underline-offset-4 transition-colors hover:underline"
        >
          {t("auth.register.loginLink")}
        </Link>
      </p>
    </div>
  );
}
