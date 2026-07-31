import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { VerifyEmailPanel } from "@/components/auth/verify-email-panel";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import { emailSchema } from "@/lib/validations/auth";

export async function generateMetadata() {
  const t = await getTranslations("auth.verify");
  return { title: t("title") };
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email: rawEmail } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email_confirmed_at) {
    redirect(routes.dashboard);
  }

  const parsedEmail = emailSchema.safeParse(rawEmail ?? user?.email ?? "");
  const email = parsedEmail.success ? parsedEmail.data : null;

  return <VerifyEmailPanel email={email} />;
}
