import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { DocumentsManager } from "@/components/profile/documents-manager";
import { getOwnDocuments } from "@/lib/dal/documents";
import { getOwnProfile } from "@/lib/dal/profile";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("profile.documents");
  return { title: t("title") };
}

export default async function ProfileDocumentsPage() {
  const [t, profile, documents] = await Promise.all([
    getTranslations("profile.documents"),
    getOwnProfile(),
    getOwnDocuments(),
  ]);

  if (!profile) {
    redirect(routes.dashboard);
  }

  return (
    <div className="flex animate-rise flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t("title")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("subtitle")}</p>
        <p className="pt-3">
          <Link
            href={routes.profileEdit}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("backToEdit")}
          </Link>
        </p>
      </div>

      <DocumentsManager documents={documents} />
    </div>
  );
}
