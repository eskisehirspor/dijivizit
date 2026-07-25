import { getTranslations } from "next-intl/server";

import { LinkForm } from "@/components/profile/link-form";
import { LinkRow } from "@/components/profile/link-row";
import type { OwnProfileLink } from "@/lib/dal/profile-links";
import { PROFILE_LINK_LIMIT } from "@/lib/profile/platforms";

export async function LinksManager({ links }: { links: OwnProfileLink[] }) {
  const t = await getTranslations("profile.links");

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-medium">{t("listTitle")}</h2>
        <p className="text-xs text-muted-foreground tabular-nums">
          {t("counter", { current: links.length, max: PROFILE_LINK_LIMIT })}
        </p>
      </div>

      {links.length === 0 ? (
        <p className="text-sm text-pretty text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="grid gap-4">
          {links.map((link, index) => (
            <LinkRow
              key={link.id}
              link={link}
              isFirst={index === 0}
              isLast={index === links.length - 1}
            />
          ))}
        </ul>
      )}

      <LinkForm linkCount={links.length} />
    </div>
  );
}
