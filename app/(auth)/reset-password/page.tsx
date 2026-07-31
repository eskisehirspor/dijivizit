import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata() {
  const t = await getTranslations("auth.resetPassword");
  return { title: t("title") };
}

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Recovery lands here after /auth/callback exchanges the PKCE code from the
  // reset email. Without a session the form cannot call updateUser.
  if (!user) {
    redirect(routes.forgotPassword);
  }

  const t = await getTranslations();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          {t("auth.resetPassword.title")}
        </h1>
        <p className="text-sm text-pretty text-muted-foreground">
          {t("auth.resetPassword.subtitle")}
        </p>
      </div>

      <ResetPasswordForm />

      <p className="text-sm text-muted-foreground">
        <Link
          href={routes.login}
          className="text-foreground underline-offset-4 transition-colors hover:underline"
        >
          {t("auth.resetPassword.backToLogin")}
        </Link>
      </p>
    </div>
  );
}
