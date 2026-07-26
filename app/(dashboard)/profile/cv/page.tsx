import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { CvManager } from "@/components/profile/cv-manager";
import { getOwnCvDocument } from "@/lib/dal/documents";
import { getOwnProfile } from "@/lib/dal/profile";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("profile.cv");
  return { title: t("title") };
}

export default async function ProfileCvPage() {
  const [t, profile, document] = await Promise.all([
    getTranslations("profile.cv"),
    getOwnProfile(),
    getOwnCvDocument(),
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

      <CvManager
        document={
          document
            ? {
                fileName: document.file_name,
                fileSize: document.file_size,
                uploadedAt: document.updated_at,
                viewUrl: routes.profileCvFile,
              }
            : null
        }
      />
    </div>
  );
}
