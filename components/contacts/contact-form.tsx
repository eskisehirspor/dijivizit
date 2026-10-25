"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { createContactAction, updateContactAction } from "@/app/actions/contacts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionResult } from "@/lib/action-result";
import { displayPhone } from "@/lib/contacts/format";

export type ContactFormValues = {
  fullName: string;
  phone: string | null;
  email: string | null;
  company: string | null;
  title: string | null;
  metWhere: string | null;
  tags: string[];
};

export function ContactForm({
  contactId,
  values,
}: {
  contactId?: string;
  values?: ContactFormValues;
}) {
  const t = useTranslations("contacts");
  const tRoot = useTranslations();
  const action = contactId ? updateContactAction.bind(null, contactId) : createContactAction;
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success(t("saved"));
    else if (!state.fieldErrors) toast.error(tRoot(state.code as never));
  }, [state, t, tRoot]);

  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};
  const field = (
    name: keyof ContactFormValues,
    props: React.ComponentProps<typeof Input> & { label: string; hint?: string },
  ) => {
    const { label, hint, ...rest } = props;
    const id = `contact-${name}`;
    const error = errors[name];
    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          name={name}
          className="h-10"
          aria-invalid={Boolean(error) || undefined}
          {...rest}
        />
        {error ? (
          <p className="text-xs text-destructive">{tRoot(error as never)}</p>
        ) : hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    );
  };

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {field("fullName", {
        label: t("fields.fullName"),
        defaultValue: values?.fullName ?? "",
        autoComplete: "off",
        maxLength: 120,
        required: true,
      })}
      <div className="grid gap-5 sm:grid-cols-2">
        {field("phone", {
          label: t("fields.phone"),
          defaultValue: values?.phone ? displayPhone(values.phone) : "",
          type: "tel",
          inputMode: "tel",
          maxLength: 40,
        })}
        {field("email", {
          label: t("fields.email"),
          defaultValue: values?.email ?? "",
          type: "email",
          maxLength: 254,
        })}
        {field("company", {
          label: t("fields.company"),
          defaultValue: values?.company ?? "",
          maxLength: 120,
        })}
        {field("title", {
          label: t("fields.title"),
          defaultValue: values?.title ?? "",
          maxLength: 120,
        })}
      </div>
      {field("metWhere", {
        label: t("fields.metWhere"),
        placeholder: t("fields.metWherePlaceholder"),
        defaultValue: values?.metWhere ?? "",
        maxLength: 120,
      })}
      {field("tags", {
        label: t("fields.tags"),
        placeholder: t("fields.tagsPlaceholder"),
        hint: t("fields.tagsHint"),
        defaultValue: values?.tags.join(", ") ?? "",
        maxLength: 330,
      })}
      <Button type="submit" className="h-10 w-fit" disabled={isPending}>
        {contactId ? t("save") : t("create")}
      </Button>
    </form>
  );
}
