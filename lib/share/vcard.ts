export type VcardLabeledValue = { value: string; label?: string | null };

export type VcardInput = {
  /** All numbers/addresses in card order; when set they replace phone/email/website. */
  phones?: VcardLabeledValue[];
  emails?: VcardLabeledValue[];
  websites?: VcardLabeledValue[];
  fullName?: string | null;
  title?: string | null;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  x?: string | null;
  facebook?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  publicUrl?: string | null;
};

function trimOrNull(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Normalizes a freeform profile address for vCard ADR.
 * Collapses newlines/whitespace into a single searchable street line so
 * Contacts apps treat it as a location and can open Maps.
 */
export function normalizeVcardAddress(value: string): string {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanList(
  list: VcardLabeledValue[] | undefined,
  single: string | null,
): { value: string; label: string | null }[] {
  if (list) {
    return list
      .map((entry) => ({ value: entry.value.trim(), label: trimOrNull(entry.label) }))
      .filter((entry) => entry.value.length > 0);
  }
  return single ? [{ value: single, label: null }] : [];
}

/** Escape text for vCard 3.0 property values. */
export function escapeVcardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function textProp(name: string, value: string): string {
  return `${name};CHARSET=UTF-8:${escapeVcardValue(value)}`;
}

/** Apple-compatible labeled URL group (imports cleanly into iOS/macOS Contacts). */
function labeledUrl(item: number, url: string, label: string): string[] {
  return [
    `item${item}.URL;type=pref:${escapeVcardValue(url)}`,
    `item${item}.X-ABLabel:${escapeVcardValue(label)}`,
  ];
}

/**
 * Builds a vCard 3.0 document for maximum contacts-app compatibility.
 * Empty fields are omitted.
 */
export function buildVcard30(input: VcardInput): string {
  const fullName = trimOrNull(input.fullName);
  const title = trimOrNull(input.title);
  const company = trimOrNull(input.company);
  const phone = trimOrNull(input.phone);
  const email = trimOrNull(input.email);
  const website = trimOrNull(input.website);
  const linkedin = trimOrNull(input.linkedin);
  const instagram = trimOrNull(input.instagram);
  const x = trimOrNull(input.x);
  const facebook = trimOrNull(input.facebook);
  const whatsapp = trimOrNull(input.whatsapp);
  const address = trimOrNull(input.address);
  const publicUrl = trimOrNull(input.publicUrl);

  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];

  if (fullName) {
    lines.push(textProp("FN", fullName));
    const parts = fullName.split(/\s+/);
    if (parts.length >= 2) {
      const family = escapeVcardValue(parts.at(-1)!);
      const given = escapeVcardValue(parts.slice(0, -1).join(" "));
      lines.push(`N;CHARSET=UTF-8:${family};${given};;;`);
    } else {
      lines.push(`N;CHARSET=UTF-8:;${escapeVcardValue(fullName)};;;`);
    }
  }

  if (company) lines.push(textProp("ORG", company));
  if (title) lines.push(textProp("TITLE", title));
  let item = 1;

  const phones = cleanList(input.phones, phone);
  phones.forEach((entry, index) => {
    const type = index === 0 ? "TEL;TYPE=CELL,VOICE" : "TEL;TYPE=VOICE";
    if (entry.label) {
      lines.push(`item${item}.${type}:${escapeVcardValue(entry.value)}`);
      lines.push(`item${item}.X-ABLabel:${escapeVcardValue(entry.label)}`);
      item += 1;
    } else {
      lines.push(`${type}:${escapeVcardValue(entry.value)}`);
    }
  });

  const emails = cleanList(input.emails, email);
  emails.forEach((entry) => {
    if (entry.label) {
      lines.push(`item${item}.EMAIL;TYPE=INTERNET:${escapeVcardValue(entry.value)}`);
      lines.push(`item${item}.X-ABLabel:${escapeVcardValue(entry.label)}`);
      item += 1;
    } else {
      lines.push(`EMAIL;TYPE=INTERNET:${escapeVcardValue(entry.value)}`);
    }
  });

  // ADR: po-box;extended;street;city;region;postal;country
  // Freeform addresses go in the street component (index 3). A single-line
  // street value imports as a tappable location in Apple/Google/Android/Outlook.
  if (address) {
    const street = normalizeVcardAddress(address);
    if (street) {
      lines.push(`ADR;TYPE=WORK;CHARSET=UTF-8:;;${escapeVcardValue(street)};;;;`);
    }
  }

  for (const entry of cleanList(input.websites, website)) {
    lines.push(...labeledUrl(item, entry.value, entry.label ?? "Website"));
    item += 1;
  }
  if (linkedin) {
    lines.push(...labeledUrl(item, linkedin, "LinkedIn"));
    item += 1;
  }
  if (instagram) {
    lines.push(...labeledUrl(item, instagram, "Instagram"));
    item += 1;
  }
  if (x) {
    lines.push(...labeledUrl(item, x, "X"));
    item += 1;
  }
  if (facebook) {
    lines.push(...labeledUrl(item, facebook, "Facebook"));
    item += 1;
  }
  if (whatsapp) {
    lines.push(...labeledUrl(item, whatsapp, "WhatsApp"));
    item += 1;
  }
  if (publicUrl) {
    lines.push(...labeledUrl(item, publicUrl, "Dijivizit"));
  }

  lines.push("END:VCARD");
  return `${lines.join("\r\n")}\r\n`;
}

export function vcardFilename(fullName: string | null | undefined): string {
  const base = trimOrNull(fullName)
    ?.normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${base && base.length > 0 ? base : "dijivizit"}.vcf`;
}
