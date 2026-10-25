"use client";

import { Check, Trash2, Undo2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  addFollowUpAction,
  addNoteAction,
  deleteContactAction,
  deleteFollowUpAction,
  deleteNoteAction,
  setFollowUpDoneAction,
} from "@/app/actions/contacts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/action-result";
import { addDays, formatDay } from "@/lib/contacts/format";
import { cn } from "@/lib/utils";

type Note = { id: string; body: string; created_at: string };
type FollowUp = { id: string; due_on: string; note: string | null; done_at: string | null };

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

const STAMP = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Istanbul",
});

export function NotesPanel({ contactId, notes }: { contactId: string; notes: Note[] }) {
  const t = useTranslations("contacts.notes");
  const [body, setBody] = useState("");
  const { run, isPending } = useRun();

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border/60 p-6">
      <h2 className="text-sm font-medium">{t("title")}</h2>
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!body.trim()) return;
          run(
            () => addNoteAction(contactId, body),
            () => setBody(""),
          );
        }}
      >
        <Textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          maxLength={2000}
          rows={3}
        />
        <Button type="submit" variant="outline" className="h-9 w-fit" disabled={isPending}>
          {t("add")}
        </Button>
      </form>
      {notes.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {notes.map((note) => (
            <li key={note.id} className="group flex gap-3 rounded-lg bg-muted/40 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-pretty whitespace-pre-line">{note.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {STAMP.format(new Date(note.created_at))}
                </p>
              </div>
              <button
                type="button"
                aria-label={t("delete")}
                className="shrink-0 self-start rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                disabled={isPending}
                onClick={() => run(() => deleteNoteAction(contactId, note.id))}
              >
                <Trash2 aria-hidden="true" className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function FollowUpsPanel({
  contactId,
  followUps,
  today,
}: {
  contactId: string;
  followUps: FollowUp[];
  today: string;
}) {
  const t = useTranslations("contacts.followUps");
  const [dueOn, setDueOn] = useState(addDays(today, 7));
  const [note, setNote] = useState("");
  const { run, isPending } = useRun();
  const open = followUps.filter((f) => !f.done_at);
  const done = followUps.filter((f) => f.done_at);

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border/60 p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">{t("title")}</h2>
        <p className="text-xs text-muted-foreground">{t("hint")}</p>
      </div>
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          run(
            () => addFollowUpAction(contactId, dueOn, note),
            () => setNote(""),
          );
        }}
      >
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["tomorrow", 1],
              ["week", 7],
              ["month", 30],
            ] as const
          ).map(([key, days]) => {
            const value = addDays(today, days);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setDueOn(value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  dueOn === value
                    ? "border-foreground bg-foreground text-background"
                    : "border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {t(`quick.${key}`)}
              </button>
            );
          })}
        </div>
        <div className="grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fu-date">{t("dueOn")}</Label>
            <Input
              id="fu-date"
              type="date"
              value={dueOn}
              min={today}
              onChange={(event) => setDueOn(event.target.value)}
              className="h-10"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="fu-note">{t("note")}</Label>
            <Input
              id="fu-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t("notePlaceholder")}
              maxLength={200}
              className="h-10"
            />
          </div>
        </div>
        <Button type="submit" variant="outline" className="h-9 w-fit" disabled={isPending}>
          {t("add")}
        </Button>
      </form>

      {followUps.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {[...open, ...done].map((f) => {
            const isDone = Boolean(f.done_at);
            const overdue = !isDone && f.due_on <= today;
            return (
              <li
                key={f.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg border border-border/60 px-4 py-3",
                  isDone && "opacity-60",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm", overdue && "font-medium", isDone && "line-through")}>
                    {formatDay(f.due_on, today)}
                    {f.note ? <span className="text-muted-foreground"> · {f.note}</span> : null}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 px-2 text-xs"
                  disabled={isPending}
                  onClick={() => run(() => setFollowUpDoneAction(contactId, f.id, !isDone))}
                >
                  {isDone ? (
                    <Undo2 aria-hidden="true" className="size-3.5" />
                  ) : (
                    <Check aria-hidden="true" className="size-3.5" />
                  )}
                  {isDone ? t("undo") : t("done")}
                </Button>
                <button
                  type="button"
                  aria-label={t("delete")}
                  className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                  disabled={isPending}
                  onClick={() => run(() => deleteFollowUpAction(contactId, f.id))}
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export function DeleteContactButton({ contactId }: { contactId: string }) {
  const t = useTranslations("contacts");
  const tRoot = useTranslations();
  const [open, setOpen] = useState(false);
  const [isPending, start] = useTransition();

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="h-9 w-fit text-destructive"
        onClick={() => setOpen(true)}
      >
        {t("delete")}
      </Button>
      <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("delete")}</DialogTitle>
            <DialogDescription>{t("deleteConfirm")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              {tRoot("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={() =>
                start(async () => {
                  const result = await deleteContactAction(contactId);
                  if (result && !result.ok) toast.error(tRoot(result.code as never));
                })
              }
            >
              {t("deleteYes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
