import { getTranslations } from "next-intl/server";

import { AdminOverviewView } from "@/components/admin/overview";
import { SITE_PERIODS, SiteOverview } from "@/components/admin/site-overview";
import { getAdminData, getAdminOrderRequests, getSiteSummary } from "@/lib/dal/admin";
import { requireInviteOwner } from "@/lib/dal/invitations";

function countSince(users: { createdAt: string }[], days: number) {
  const since = Date.now() - days * 86400_000;
  return users.filter((u) => Date.parse(u.createdAt) >= since).length;
}

export async function generateMetadata() {
  const t = await getTranslations("dashboard.admin");
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ gun?: string }>;
}) {
  await requireInviteOwner();

  const { gun } = await searchParams;
  const days = SITE_PERIODS.find((d) => String(d) === gun) ?? 30;

  const [data, orders, summary] = await Promise.all([
    getAdminData(),
    getAdminOrderRequests(),
    getSiteSummary(days),
  ]);
  const newUsers = countSince(data.users, days);

  return (
    <AdminOverviewView
      {...data}
      orders={orders}
      site={<SiteOverview summary={summary} newUsers={newUsers} />}
    />
  );
}
