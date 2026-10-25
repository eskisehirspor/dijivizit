import { Download, Plus, Search } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { displayPhone, formatDay, istanbulToday } from "@/lib/contacts/format";
import { listOwnContacts, listOwnTags } from "@/lib/dal/contacts";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export async function generateMetadata() {
  const t = await getTranslations("contacts");
  return { title: t("title") };
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; etiket?: string }>;
}) {
  const { q = "", etiket = "" } = await searchParams;
  const query = q.slice(0, 60);
  const tag = etiket.slice(0, 30);
  const [t, contacts, tags] = await Promise.all([
    getTranslations("contacts"),
    listOwnContacts({ q: query, tag: tag || undefined }),
    listOwnTags(),
  ]);
  const today = istanbulToday();
  const tagHref = (value: string) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (value) params.set("etiket", value);
    const s = params.toString();
    return s ? `${routes.contacts}?${s}` : routes.contacts;
  };

  return (
    <div className="flex animate-rise flex-col gap-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t("title")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("subtitle")}</p>
        <div className="flex flex-wrap gap-2 pt-4">
          <Button asChild className="h-10">
            <Link href={routes.contactNew}>
              <Plus aria-hidden="true" className="size-4" />
              {t("new")}
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-10">
            <a href={routes.contactsExport} download>
              <Download aria-hidden="true" className="size-4" />
              {t("export")}
            </a>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <form action={routes.contacts} className="flex gap-2" role="search">
          {tag ? <input type="hidden" name="etiket" value={tag} /> : null}
          <Input
            name="q"
            defaultValue={query}
            placeholder={t("search")}
            aria-label={t("search")}
            className="h-10"
            maxLength={60}
          />
          <Button type="submit" variant="outline" className="h-10" aria-label={t("searchSubmit")}>
            <Search aria-hidden="true" className="size-4" />
          </Button>
        </form>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {["", ...tags].map((value) => (
              <Link
                key={value || "all"}
                href={tagHref(value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  value === tag
                    ? "border-foreground bg-foreground text-background"
                    : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                {value ? `#${value}` : t("allTags")}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      {contacts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-pretty text-muted-foreground">
          {query || tag ? t("emptySearch") : t("empty")}
        </p>
      ) : (
        <section className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">{t("count", { count: contacts.length })}</p>
          <ul className="flex flex-col divide-y divide-border/60 rounded-lg border border-border/60">
            {contacts.map((c) => {
              const sub = [c.title, c.company].filter(Boolean).join(" · ");
              const reach = c.phone ? displayPhone(c.phone) : (c.email ?? "");
              const overdue = c.nextFollowUp !== null && c.nextFollowUp <= today;
              return (
                <li key={c.id}>
                  <Link
                    href={routes.contact(c.id)}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">{c.full_name}</span>
                        {c.source === "card_form" ? (
                          <Badge variant="secondary" className="shrink-0">
                            {t("fromCard")}
                          </Badge>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {[sub, reach].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    {c.nextFollowUp ? (
                      <span
                        className={cn(
                          "shrink-0 text-xs",
                          overdue ? "font-medium text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {t("next", { date: formatDay(c.nextFollowUp, today) })}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
