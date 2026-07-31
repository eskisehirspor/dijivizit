import {
  Building2,
  ChartColumn,
  Eye,
  FileText,
  Link2,
  Pencil,
  Receipt,
  Share2,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type QuickAction = {
  key: string;
  title: string;
  description: string;
  icon: ReactNode;
} & ({ href: string; disabled?: false } | { href?: undefined; disabled: true });

export async function QuickActions({
  editHref,
  avatarHref,
  linksHref,
  skillsHref,
  bankHref,
  billingHref,
  cvHref,
  analyticsHref,
  shareHref,
  publicHref,
}: {
  editHref: string;
  avatarHref: string;
  linksHref: string;
  skillsHref: string;
  bankHref: string;
  billingHref: string;
  cvHref: string;
  analyticsHref: string;
  shareHref: string;
  publicHref: string | null;
}) {
  const t = await getTranslations("dashboard.actions");

  const actions: QuickAction[] = [
    {
      key: "edit",
      title: t("editProfile"),
      description: t("editProfileDescription"),
      icon: <Pencil aria-hidden="true" className="size-4" />,
      href: editHref,
    },
    {
      key: "avatar",
      title: t("manageAvatar"),
      description: t("manageAvatarDescription"),
      icon: <UserRound aria-hidden="true" className="size-4" />,
      href: avatarHref,
    },
    {
      key: "links",
      title: t("manageLinks"),
      description: t("manageLinksDescription"),
      icon: <Link2 aria-hidden="true" className="size-4" />,
      href: linksHref,
    },
    {
      key: "skills",
      title: t("manageSkills"),
      description: t("manageSkillsDescription"),
      icon: <Sparkles aria-hidden="true" className="size-4" />,
      href: skillsHref,
    },
    {
      key: "bank",
      title: t("manageBank"),
      description: t("manageBankDescription"),
      icon: <Building2 aria-hidden="true" className="size-4" />,
      href: bankHref,
    },
    {
      key: "billing",
      title: t("manageBilling"),
      description: t("manageBillingDescription"),
      icon: <Receipt aria-hidden="true" className="size-4" />,
      href: billingHref,
    },
    {
      key: "cv",
      title: t("manageCv"),
      description: t("manageCvDescription"),
      icon: <FileText aria-hidden="true" className="size-4" />,
      href: cvHref,
    },
    {
      key: "analytics",
      title: t("analytics"),
      description: t("analyticsDescription"),
      icon: <ChartColumn aria-hidden="true" className="size-4" />,
      href: analyticsHref,
    },
    {
      key: "share",
      title: t("share"),
      description: t("shareDescription"),
      icon: <Share2 aria-hidden="true" className="size-4" />,
      href: shareHref,
    },
    publicHref
      ? {
          key: "view",
          title: t("viewPublic"),
          description: t("viewPublicDescription"),
          icon: <Eye aria-hidden="true" className="size-4" />,
          href: publicHref,
        }
      : {
          key: "view",
          title: t("viewPublic"),
          description: t("viewPublicDescription"),
          icon: <Eye aria-hidden="true" className="size-4" />,
          disabled: true,
        },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-medium">{t("title")}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <li key={action.key}>
            {action.disabled ? (
              <div
                aria-disabled="true"
                className={cn(
                  "flex h-full flex-col gap-3 rounded-lg border border-border/60 p-6",
                  "cursor-not-allowed opacity-50",
                )}
              >
                <ActionBody action={action} />
              </div>
            ) : (
              <Link
                href={action.href}
                className={cn(
                  "flex h-full flex-col gap-3 rounded-lg border border-border/60 p-6",
                  "transition-colors hover:border-border hover:bg-muted/40",
                )}
              >
                <ActionBody action={action} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ActionBody({ action }: { action: QuickAction }) {
  return (
    <>
      <span className="text-muted-foreground">{action.icon}</span>
      <span className="text-sm font-medium">{action.title}</span>
      <span className="text-xs text-pretty text-muted-foreground">{action.description}</span>
    </>
  );
}
