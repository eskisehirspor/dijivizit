import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("auth.forgotPassword");
  return { title: t("title") };
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          {t("auth.forgotPassword.title")}
        </h1>
        <p className="text-sm text-pretty text-muted-foreground">
          {t("auth.forgotPassword.subtitle")}
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="text-sm text-muted-foreground">
        <Link
          href={routes.login}
          className="text-foreground underline-offset-4 transition-colors hover:underline"
        >
          {t("auth.forgotPassword.backToLogin")}
        </Link>
      </p>
    </div>
  );
}
