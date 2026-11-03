"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { updateOrderStatusAction } from "@/app/actions/admin-orders";
import { formatDate, formatRelative } from "@/lib/admin/format";
import {
  ORDER_STATUSES,
  whatsappLink,
  type AdminOrderRequest,
  type OrderStatus,
} from "@/lib/admin/orders";
import { finishLabel, formatTry, isFinishId } from "@/lib/orders/finishes";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<OrderStatus, string> = {
  new: "bg-neutral-950 text-white",
  contacted: "bg-amber-100 text-amber-900",
  won: "bg-emerald-100 text-emerald-900",
  lost: "bg-muted text-muted-foreground",
};

function Row({ order }: { order: AdminOrderRequest }) {
  const t = useTranslations("dashboard.admin.orders");
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [pending, startTransition] = useTransition();
  const wa = whatsappLink(order.phone);
  const product = isFinishId(order.finish) ? finishLabel(order.finish) : order.finish;

  function change(next: OrderStatus) {
    if (next === status) return;
    const previous = status;
    setStatus(next);
    startTransition(async () => {
      const result = await updateOrderStatusAction(order.id, next);
      if (!result.ok) setStatus(previous);
    });
  }

  return (
    <li className="flex flex-col gap-4 rounded-lg border border-border/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="font-medium">{order.fullName}</p>
          <p className="text-sm text-muted-foreground">
            {product} × {order.quantity}
          </p>
          {order.source === "shopier" ? (
            <p className="text-xs font-medium text-emerald-700">
              {t("paid", { total: formatTry(order.paidTotal ?? 0) })}
            </p>
          ) : null}
        </div>
        <p
          className="text-xs text-muted-foreground tabular-nums"
          title={formatDate(order.createdAt)}
        >
          {formatRelative(order.createdAt)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <a
          href={`tel:${order.phone.replace(/\s/g, "")}`}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-3 hover:bg-muted"
        >
          <Phone className="size-4" aria-hidden="true" />
          {order.phone}
        </a>
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-3 hover:bg-muted"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            WhatsApp
          </a>
        ) : null}
        <a
          href={`mailto:${order.email}`}
          className="inline-flex h-9 min-w-0 items-center gap-2 rounded-full border border-border px-3 hover:bg-muted"
        >
          <Mail className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{order.email}</span>
        </a>
      </div>

      {order.note ? (
        <p className="rounded-md bg-muted/60 px-3 py-2 text-sm whitespace-pre-line text-foreground/85">
          {order.note}
        </p>
      ) : null}

      <div
        role="radiogroup"
        aria-label={t("statusLabel")}
        className={cn("flex flex-wrap gap-1.5", pending && "opacity-60")}
      >
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={status === s}
            onClick={() => change(s)}
            className={cn(
              "h-8 rounded-full px-3 text-xs font-medium transition-colors",
              status === s ? STATUS_TONE[s] : "border border-border hover:bg-muted",
            )}
          >
            {t(`status.${s}`)}
          </button>
        ))}
      </div>
    </li>
  );
}

export function OrderRequestList({ orders }: { orders: AdminOrderRequest[] }) {
  const t = useTranslations("dashboard.admin.orders");
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (orders.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5">
        {(["all", ...ORDER_STATUSES] as const).map((f) => {
          const count = f === "all" ? orders.length : orders.filter((o) => o.status === f).length;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "h-8 rounded-full px-3 text-xs font-medium tabular-nums transition-colors",
                filter === f
                  ? "bg-foreground text-background"
                  : "border border-border hover:bg-muted",
              )}
            >
              {f === "all" ? t("all") : t(`status.${f}`)} {count}
            </button>
          );
        })}
      </div>
      <ul className="flex flex-col gap-3">
        {shown.map((o) => (
          <Row key={o.id} order={o} />
        ))}
      </ul>
    </div>
  );
}
