"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  acceptInviteAction,
  createTeamAction,
  deleteTeamAction,
  inviteMemberAction,
  leaveTeamAction,
  removeMemberAction,
  renameTeamAction,
  revokeInviteAction,
  setMemberRoleAction,
} from "@/app/actions/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ActionResult } from "@/lib/action-result";

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

export function CreateTeamForm() {
  const t = useTranslations("team");
  const { run, isPending } = useRun();
  const [name, setName] = useState("");
  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        run(() => createTeamAction(name));
      }}
    >
      <label className="flex flex-1 flex-col gap-1.5 text-xs text-muted-foreground">
        {t("nameLabel")}
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          maxLength={120}
          className="h-10"
          required
        />
      </label>
      <Button type="submit" className="h-10" disabled={isPending}>
        {t("create")}
      </Button>
    </form>
  );
}

export function AcceptInviteButton({ inviteId }: { inviteId: string }) {
  const t = useTranslations("team");
  const { run, isPending } = useRun();
  return (
    <Button
      type="button"
      className="h-9"
      disabled={isPending}
      onClick={() => run(() => acceptInviteAction(inviteId))}
    >
      {t("join")}
    </Button>
  );
}

export function RenameTeamForm({ orgId, name }: { orgId: string; name: string }) {
  const t = useTranslations("team");
  const { run, isPending } = useRun();
  const [value, setValue] = useState(name);
  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        run(
          () => renameTeamAction(orgId, value),
          () => toast.success(t("saved")),
        );
      }}
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label={t("nameLabel")}
        maxLength={120}
        className="h-9 max-w-xs"
      />
      <Button
        type="submit"
        variant="outline"
        className="h-9"
        disabled={isPending || value === name}
      >
        {t("save")}
      </Button>
    </form>
  );
}

export function InviteForm({ orgId }: { orgId: string }) {
  const t = useTranslations("team");
  const { run, isPending } = useRun();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        run(
          () => inviteMemberAction(orgId, email, role),
          () => {
            setEmail("");
            toast.success(t("invited"));
          },
        );
      }}
    >
      <label className="flex flex-1 flex-col gap-1.5 text-xs text-muted-foreground">
        {t("inviteEmail")}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ad@sirket.com"
          className="h-10"
          required
        />
      </label>
      <label className="flex flex-col gap-1.5 text-xs text-muted-foreground">
        {t("role")}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="member">{t("roles.member")}</option>
          <option value="admin">{t("roles.admin")}</option>
        </select>
      </label>
      <Button type="submit" className="h-10" disabled={isPending}>
        {t("invite")}
      </Button>
    </form>
  );
}

export function RevokeInviteButton({ inviteId }: { inviteId: string }) {
  const t = useTranslations("team");
  const { run, isPending } = useRun();
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-8 px-2 text-xs"
      disabled={isPending}
      onClick={() => run(() => revokeInviteAction(inviteId))}
    >
      {t("revoke")}
    </Button>
  );
}

export function MemberControls({
  orgId,
  userId,
  role,
  canManage,
  isSelf,
}: {
  orgId: string;
  userId: string;
  role: string;
  canManage: boolean;
  isSelf: boolean;
}) {
  const t = useTranslations("team");
  const { run, isPending } = useRun();
  if (!canManage || isSelf) {
    return <span className="text-xs text-muted-foreground">{t(`roles.${role}` as never)}</span>;
  }
  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        disabled={isPending}
        aria-label={t("role")}
        onChange={(e) => run(() => setMemberRoleAction(orgId, userId, e.target.value))}
        className="h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground"
      >
        <option value="member">{t("roles.member")}</option>
        <option value="admin">{t("roles.admin")}</option>
        <option value="owner">{t("roles.owner")}</option>
      </select>
      <Button
        type="button"
        variant="ghost"
        className="h-8 px-2 text-xs text-destructive"
        disabled={isPending}
        onClick={() => {
          if (window.confirm(t("removeConfirm"))) run(() => removeMemberAction(orgId, userId));
        }}
      >
        {t("remove")}
      </Button>
    </div>
  );
}

export function LeaveOrDeleteTeam({ orgId, isOwner }: { orgId: string; isOwner: boolean }) {
  const t = useTranslations("team");
  const { run, isPending } = useRun();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="ghost"
        className="h-9"
        disabled={isPending}
        onClick={() => {
          if (window.confirm(t("leaveConfirm"))) run(() => leaveTeamAction(orgId));
        }}
      >
        {t("leave")}
      </Button>
      {isOwner ? (
        <Button
          type="button"
          variant="ghost"
          className="h-9 text-destructive"
          disabled={isPending}
          onClick={() => {
            if (window.confirm(t("deleteConfirm"))) run(() => deleteTeamAction(orgId));
          }}
        >
          {t("delete")}
        </Button>
      ) : null}
    </div>
  );
}
