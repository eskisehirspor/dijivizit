import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { CONTACT } from "@/lib/contact";

/** Address, phone, WhatsApp and email as tappable tiles. */
export function ContactDetails() {
  const items = [
    {
      icon: MapPin,
      label: "Adres",
      value: (
        <address className="not-italic">
          {CONTACT.addressLines[0]}
          <br />
          {CONTACT.addressLines[1]}
        </address>
      ),
      href: CONTACT.mapsUrl,
      external: true,
    },
    {
      icon: Phone,
      label: "Telefon",
      value: CONTACT.phoneDisplay,
      href: `tel:${CONTACT.phoneE164}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: CONTACT.phoneDisplay,
      href: CONTACT.whatsappUrl,
      external: true,
    },
    {
      icon: Mail,
      label: "E-posta",
      value: CONTACT.orderEmail,
      href: `mailto:${CONTACT.orderEmail}`,
    },
  ];

  return (
    <ul className="grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 sm:grid-cols-2">
      {items.map(({ icon: Icon, label, value, href, external }) => (
        <li key={label} className="flex bg-background">
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex flex-1 gap-4 p-6 transition-colors hover:bg-muted/50"
          >
            <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">{label}</span>
              <div className="text-base font-medium underline-offset-4 group-hover:underline">
                {value}
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
