"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight, Search } from "lucide-react";

import { UserAvatar } from "@/components/admin/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate, formatRelative } from "@/lib/admin/format";
import {
  filterAndSortUsers,
  type AdminUserFilter,
  type AdminUserSort,
  type CardState,
} from "@/lib/admin/summary";
import type { AdminUserListItem } from "@/lib/dal/admin";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const FILTERS: AdminUserFilter[] = ["all", "published", "draft", "empty"];
const SORTS: AdminUserSort[] = ["newest", "lastSignIn", "views", "completeness"];

const STATE_VARIANT: Record<CardState, "default" | "secondary" | "outline"> = {
  published: "default",
  draft: "secondary",
  empty: "outline",
};

export function UserList({ users }: { users: AdminUserListItem[] }) {
  const t = useTranslations("dashboard.admin.users");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<AdminUserFilter>("all");
  const [sort, setSort] = useState<AdminUserSort>("newest");

  const counts = useMemo(() => {
    const result: Record<AdminUserFilter, number> = {
      all: users.length,
      published: 0,
      draft: 0,
      empty: 0,
    };
    for (const user of users) {
      result[user.cardState] += 1;
    }
    return result;
  }, [users]);

  const visible = useMemo(
    () => filterAndSortUsers(users, { query, filter, sort }),
    [users, query, filter, sort],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search")}
            aria-label={t("search")}
            className="h-10 pl-9"
          />
        </div>
        <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="sr-only sm:not-sr-only">{t("sortLabel")}</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as AdminUserSort)}
            className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground sm:w-auto"
          >
            {SORTS.map((option) => (
              <option key={option} value={option}>
                {t(`sort.${option}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label={t("title")}>
        {FILTERS.map((option) => {
          const selected = filter === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(option)}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-full border px-3 text-sm transition-colors",
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {t(`filters.${option}`)}
              <span className={cn("text-xs tabular-nums", selected ? "opacity-70" : "opacity-60")}>
                {counts[option]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
        {t("count", { shown: visible.length, total: users.length })}
      </p>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-pretty text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="divide-y divide-border/60 overflow-hidden rounded-lg border border-border/60">
          {visible.map((user) => (
            <li key={user.id}>
              <UserRow user={user} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function UserRow({ user }: { user: AdminUserListItem }) {
  const t = useTranslations("dashboard.admin.users");
  const subtitle = [user.title, user.company].filter(Boolean).join(" · ");

  return (
    <Link
      href={routes.adminUser(user.id)}
      className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none sm:px-5"
    >
      <UserAvatar name={user.fullName} email={user.email} url={user.avatarUrl} />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-medium">{user.fullName?.trim() || t("noName")}</p>
          {user.isOwner ? (
            <Badge variant="outline" className="shrink-0">
              {t("owner")}
            </Badge>
          ) : null}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {[user.email, subtitle].filter(Boolean).join(" · ")}
        </p>
        <p className="text-xs text-muted-foreground tabular-nums sm:hidden">
          {t(`state.${user.cardState}`)} · {t("views", { count: user.viewsTotal })}
        </p>
      </div>

      <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
        <Badge variant={STATE_VARIANT[user.cardState]}>{t(`state.${user.cardState}`)}</Badge>
        <p className="text-xs text-muted-foreground tabular-nums">
          {t("views", { count: user.viewsTotal })}
        </p>
      </div>

      <div className="hidden w-28 shrink-0 flex-col gap-1.5 md:flex">
        <CompletenessBar
          percent={user.completenessPercent}
          label={t("completeness", { percent: user.completenessPercent })}
        />
        <p
          suppressHydrationWarning
          className="truncate text-xs text-muted-foreground"
          title={user.lastSignInAt ? formatDate(user.lastSignInAt) : undefined}
        >
          {user.lastSignInAt
            ? t("lastSeen", { date: formatRelative(user.lastSignInAt) })
            : t("neverSignedIn")}
        </p>
      </div>

      <ChevronRight
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}

export function CompletenessBar({ percent, label }: { percent: number; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground tabular-nums">{label}</span>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-muted"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={label}
      >
        <div className="h-full rounded-full bg-foreground/80" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
