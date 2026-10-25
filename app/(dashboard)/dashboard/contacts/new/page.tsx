import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ContactForm } from "@/components/contacts/contact-form";
import { requireUser } from "@/lib/dal/auth";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("contacts");
  return { title: t("newTitle") };
}

export default async function NewContactPage() {
  await requireUser();
  const t = await getTranslations("contacts");

  return (
    <div className="flex animate-rise flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t("newTitle")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("newSubtitle")}</p>
        <p className="pt-3">
          <Link
            href={routes.contacts}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("back")}
          </Link>
        </p>
      </div>
      <ContactForm />
    </div>
  );
}
