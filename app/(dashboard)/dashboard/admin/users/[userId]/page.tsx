import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { AdminUserDetailView } from "@/components/admin/user-detail";
import { getAdminUserDetail } from "@/lib/dal/admin";
import { requireInviteOwner } from "@/lib/dal/invitations";

type AdminUserPageProps = {
  params: Promise<{ userId: string }>;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata() {
  const t = await getTranslations("dashboard.admin");
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function AdminUserPage({ params }: AdminUserPageProps) {
  await requireInviteOwner();

  const { userId } = await params;

  if (!UUID_PATTERN.test(userId)) {
    notFound();
  }

  const user = await getAdminUserDetail(userId);

  if (!user) {
    notFound();
  }

  return <AdminUserDetailView user={user} />;
}
