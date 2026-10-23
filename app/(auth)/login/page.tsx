import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { AuthDivider } from "@/components/auth/auth-divider";
import { GoogleButton } from "@/components/auth/google-button";
import { LoginForm } from "@/components/auth/login-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { pageErrorKey } from "@/lib/auth/errors";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("auth.login");
  return { title: t("title") };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; deleted?: string }>;
}) {
  const { next, error, deleted } = await searchParams;
  const t = await getTranslations();

  const errorKey = pageErrorKey(error);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[1.75rem] leading-tight font-semibold text-balance">
          {t("auth.login.title")}
        </h1>
        <p className="text-[0.9375rem] text-pretty text-muted-foreground">
          {t("auth.login.subtitle")}
        </p>
      </div>

      {deleted === "1" ? (
        <Alert>
          <AlertDescription>{t("auth.login.deleted")}</AlertDescription>
        </Alert>
      ) : null}

      {errorKey ? (
        <Alert variant="destructive">
          <AlertDescription>{t(errorKey)}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-5">
        <GoogleButton />
        <AuthDivider />
        <LoginForm next={next} />
      </div>

      <p className="text-sm text-muted-foreground">
        {t("auth.login.noAccount")}{" "}
        <Link
          href={routes.register}
          className="text-foreground underline-offset-4 transition-colors hover:underline"
        >
          {t("auth.login.registerLink")}
        </Link>
      </p>
    </div>
  );
}
