"use client";

import { Check, Copy, QrCode, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  assignCardAction,
  createCardAction,
  deleteCardAction,
  renameCardAction,
  setCardActiveAction,
} from "@/app/actions/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { ActionResult } from "@/lib/action-result";
import { cn } from "@/lib/utils";

export type CardListItem = {
  id: string;
  slug: string;
  label: string | null;
  is_active: boolean;
  assigned_to: string | null;
  views30d: number;
  contacts: number;
  orgName?: string;
};

export type Member = { userId: string; name: string };

function useRun() {
  const tRoot = useTranslations();
  const router = useRouter();
  const [isPending, start] = useTransition();
  const run = (fn: () => Promise<ActionResult>, onOk?: () => void) =>
    start(async () => {
      const result = await fn();
      if (result && !result.ok) {
        toast.error(tRoot(result.code as never));
        return;
      }
      onOk?.();
      router.refresh();
    });
  return { run, isPending };
}

async function downloadQr(url: string, name: string) {
  const dataUrl = await QRCode.toDataURL(url, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 1024,
    color: { dark: "#0a0a0a", light: "#ffffff" },
  });
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `dijivizit-${name}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function CardList({
  cards,
  baseUrl,
  mode,
  members = [],
}: {
  cards: CardListItem[];
  baseUrl: string;
  mode: "personal" | "team" | "assigned";
  members?: Member[];
}) {
  const t = useTranslations("cards");
  if (cards.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }
  return (
    <ul className="flex flex-col gap-3">
      {cards.map((card) => (
        <CardRow key={card.id} card={card} baseUrl={baseUrl} mode={mode} members={members} />
      ))}
    </ul>
  );
}

function CardRow({
  card,
  baseUrl,
  mode,
  members,
}: {
  card: CardListItem;
  baseUrl: string;
  mode: "personal" | "team" | "assigned";
  members: Member[];
}) {
  const t = useTranslations("cards");
  const { run, isPending } = useRun();
  const [label, setLabel] = useState(card.label ?? "");
  const [copied, setCopied] = useState(false);
  const url = `${baseUrl}/p/${card.slug}`;
  const editable = mode !== "assigned";

  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-border/60 p-5",
        !card.is_active && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {editable ? (
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={() => {
                if (label !== (card.label ?? "")) run(() => renameCardAction(card.id, label));
              }}
              placeholder={t("labelPlaceholder")}
              aria-label={t("label")}
              maxLength={60}
              className="h-9 max-w-xs"
            />
          ) : (
            <p className="text-sm font-medium">
              {card.label || t("untitled")}
              {card.orgName ? (
                <span className="font-normal text-muted-foreground"> · {card.orgName}</span>
              ) : null}
            </p>
          )}
          <p className="truncate font-mono text-xs text-muted-foreground">{url}</p>
        </div>
        {editable ? (
          <div className="flex items-center gap-2 pt-1.5">
            <span className="text-xs text-muted-foreground">
              {card.is_active ? t("active") : t("inactive")}
            </span>
            <Switch
              checked={card.is_active}
              disabled={isPending}
              aria-label={t("activeToggle")}
              onCheckedChange={(next) => run(() => setCardActiveAction(card.id, next))}
            />
          </div>
        ) : null}
      </div>

      {mode === "team" ? (
        <label className="flex flex-col gap-1.5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
          {t("assignedTo")}
          <select
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
            value={card.assigned_to ?? ""}
            disabled={isPending}
            onChange={(e) => run(() => assignCardAction(card.id, e.target.value || null))}
          >
            <option value="">{t("unassigned")}</option>
            {members.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {t("stats", { views: card.views30d, contacts: card.contacts })}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-8 px-3 text-xs"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              } catch {
                toast.error(t("copyFailed"));
              }
            }}
          >
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            {t("copy")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-8 px-3 text-xs"
            onClick={() => downloadQr(url, card.slug).catch(() => toast.error(t("qrFailed")))}
          >
            <QrCode aria-hidden="true" />
            {t("qr")}
          </Button>
          {editable ? (
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-2 text-xs text-muted-foreground"
              disabled={isPending}
              aria-label={t("delete")}
              onClick={() => {
                if (window.confirm(t("deleteConfirm"))) run(() => deleteCardAction(card.id));
              }}
            >
              <Trash2 aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function NewCardForm({ orgId, bulk = false }: { orgId?: string; bulk?: boolean }) {
  const t = useTranslations("cards");
  const { run, isPending } = useRun();
  const [label, setLabel] = useState("");
  const [count, setCount] = useState(1);

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        run(
          () => createCardAction(label, orgId, count),
          () => {
            setLabel("");
            setCount(1);
          },
        );
      }}
    >
      <label className="flex flex-1 flex-col gap-1.5 text-xs text-muted-foreground">
        {t("label")}
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={t("labelPlaceholder")}
          maxLength={60}
          className="h-10"
        />
      </label>
      {bulk ? (
        <label className="flex w-28 flex-col gap-1.5 text-xs text-muted-foreground">
          {t("count")}
          <Input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
            className="h-10"
          />
        </label>
      ) : null}
      <Button type="submit" className="h-10" disabled={isPending}>
        {t("create")}
      </Button>
    </form>
  );
}
