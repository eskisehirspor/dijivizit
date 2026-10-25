import { Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import {
  DeleteContactButton,
  FollowUpsPanel,
  NotesPanel,
} from "@/components/contacts/contact-activity";
import { ContactForm } from "@/components/contacts/contact-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { displayPhone, followUpMessage, istanbulToday, whatsappHref } from "@/lib/contacts/format";
import { getOwnContact } from "@/lib/dal/contacts";
import { getOwnProfile } from "@/lib/dal/profile";
import { clientEnv } from "@/lib/env/client";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ contactId: string }> };

export async function generateMetadata({ params }: Props) {
  const { contactId } = await params;
  const contact = z.uuid().safeParse(contactId).success ? await getOwnContact(contactId) : null;
  return { title: contact?.full_name ?? "Kişi" };
}

export default async function ContactPage({ params }: Props) {
  const { contactId } = await params;
  if (!z.uuid().safeParse(contactId).success) notFound();

  const [t, contact, profile] = await Promise.all([
    getTranslations("contacts"),
    getOwnContact(contactId),
    getOwnProfile(),
  ]);
  if (!contact) notFound();

  const today = istanbulToday();
  const cardUrl = profile
    ? `${clientEnv.NEXT_PUBLIC_SITE_URL}${routes.publicCard(profile.public_id)}`
    : clientEnv.NEXT_PUBLIC_SITE_URL;
  const wa = whatsappHref(
    contact.phone,
    followUpMessage({
      contactName: contact.full_name,
      ownerName: profile?.full_name ?? null,
      cardUrl,
    }),
  );
  const sub = [contact.title, contact.company].filter(Boolean).join(" · ");

  return (
    <div className="flex animate-rise flex-col gap-10">
      <div className="flex flex-col gap-2">
        <p>
          <Link
            href={routes.contacts}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("back")}
          </Link>
        </p>
        <h1 className="pt-3 text-2xl font-semibold tracking-tight text-balance">
          {contact.full_name}
        </h1>
        {sub ? <p className="text-sm text-muted-foreground">{sub}</p> : null}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant={contact.source === "card_form" ? "secondary" : "outline"}>
            {t(`source.${contact.source === "card_form" ? "card_form" : "manual"}`)}
          </Badge>
          {contact.met_where ? (
            <span className="text-xs text-muted-foreground">{contact.met_where}</span>
          ) : null}
          {contact.tags.map((tag) => (
            <Link
              key={tag}
              href={`${routes.contacts}?etiket=${encodeURIComponent(tag)}`}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-4">
          {wa ? (
            <Button asChild className="h-10">
              <a href={wa} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" className="size-4" />
                {t("actions.whatsapp")}
              </a>
            </Button>
          ) : null}
          {contact.phone ? (
            <Button asChild variant="outline" className="h-10">
              <a href={`tel:${contact.phone}`}>
                <Phone aria-hidden="true" className="size-4" />
                {displayPhone(contact.phone)}
              </a>
            </Button>
          ) : null}
          {contact.email ? (
            <Button asChild variant="outline" className="h-10">
              <a href={`mailto:${contact.email}`}>
                <Mail aria-hidden="true" className="size-4" />
                {contact.email}
              </a>
            </Button>
          ) : null}
        </div>
      </div>

      {contact.message ? (
        <section className="flex flex-col gap-2 rounded-lg bg-muted/40 p-6">
          <h2 className="text-xs font-medium text-muted-foreground">{t("message")}</h2>
          <p className="text-sm text-pretty whitespace-pre-line">{contact.message}</p>
        </section>
      ) : null}

      <FollowUpsPanel contactId={contact.id} followUps={contact.followUps} today={today} />
      <NotesPanel contactId={contact.id} notes={contact.notes} />

      <details className="group rounded-lg border border-border/60 p-6">
        <summary className="cursor-pointer text-sm font-medium">{t("edit")}</summary>
        <div className="pt-6">
          <ContactForm
            contactId={contact.id}
            values={{
              fullName: contact.full_name,
              phone: contact.phone,
              email: contact.email,
              company: contact.company,
              title: contact.title,
              metWhere: contact.met_where,
              tags: contact.tags,
            }}
          />
        </div>
      </details>

      <DeleteContactButton contactId={contact.id} />
    </div>
  );
}
