import { getTranslations } from "next-intl/server";

import { AdminOverviewView } from "@/components/admin/overview";
import { getAdminData } from "@/lib/dal/admin";
import { requireInviteOwner } from "@/lib/dal/invitations";

export async function generateMetadata() {
  const t = await getTranslations("dashboard.admin");
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function AdminPage() {
  await requireInviteOwner();

  const data = await getAdminData();

  return <AdminOverviewView {...data} />;
}
