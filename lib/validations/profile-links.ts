import { z } from "zod";

import {
  isUsernamePlatform,
  MVP_LINK_PLATFORMS,
  USERNAME_PLATFORM_PREFIXES,
  type UsernamePlatform,
} from "@/lib/profile/platforms";

const phonePattern = /^\+?[0-9][0-9 ()./-]{3,31}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const httpUrlPattern = /^https?:\/\//i;
const usernamePattern = /^[A-Za-z0-9._-]{1,64}$/;

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Strip tel: prefixes, unicode spaces/dashes so pasted numbers validate reliably. */
export function sanitizePhoneInput(raw: string): string {
  return raw
    .trim()
    .replace(/^tel:/i, "")
    .replace(/[\u00A0\u202F\u2007\u2060]/g, " ")
    .replace(/[－−–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pulls a bare username out of a stored profile URL (or a raw username / @handle).
 * Used so the editor can show only the editable segment.
 */
export function extractUsername(platform: UsernamePlatform, raw: string): string {
  const trimmed = raw.trim().replace(/^@+/, "");
  if (!trimmed) {
    return "";
  }

  const prefix = USERNAME_PLATFORM_PREFIXES[platform];

  try {
    const asUrl = httpUrlPattern.test(trimmed)
      ? new URL(trimmed)
      : trimmed.includes(".") && trimmed.includes("/")
        ? new URL(`https://${trimmed}`)
        : null;

    if (asUrl) {
      const segments = asUrl.pathname.split("/").filter(Boolean);
      if (platform === "linkedin") {
        const inIndex = segments.indexOf("in");
        if (inIndex >= 0 && segments[inIndex + 1]) {
          return segments[inIndex + 1] ?? "";
        }
      }
      return segments[0] ?? "";
    }
  } catch {
    // Fall through to treat the raw string as a username.
  }

  if (trimmed.toLowerCase().startsWith(prefix.toLowerCase())) {
    return trimmed.slice(prefix.length).split("/").filter(Boolean)[0] ?? "";
  }

  return trimmed.split("/").filter(Boolean)[0] ?? trimmed;
}

function normalizeUsernamePlatform(
  platform: UsernamePlatform,
  raw: string,
): { ok: true; value: string } | { ok: false; message: string } {
  const username = extractUsername(platform, raw);

  if (!username) {
    return { ok: false, message: "validation.link.valueRequired" };
  }

  if (!usernamePattern.test(username)) {
    return { ok: false, message: "validation.link.usernameInvalid" };
  }

  return { ok: true, value: `${USERNAME_PLATFORM_PREFIXES[platform]}${username}` };
}

/**
 * Normalises and validates a link value for the chosen platform.
 *
 * Username platforms (Instagram, LinkedIn, X) accept a bare username or a full
 * URL and always store the canonical profile URL.
 *
 * WhatsApp accepts a phone number or a wa.me URL and is stored as
 * `https://wa.me/{digits}` so it satisfies the DB https check.
 * Bare website-like values get an `https://` prefix when the scheme is omitted.
 */
export function normalizeLinkValue(
  platform: string,
  raw: string,
): { ok: true; value: string } | { ok: false; message: string } {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { ok: false, message: "validation.link.valueRequired" };
  }

  if (isUsernamePlatform(platform)) {
    return normalizeUsernamePlatform(platform, trimmed);
  }

  switch (platform) {
    case "phone": {
      const cleaned = sanitizePhoneInput(trimmed);
      if (!phonePattern.test(cleaned)) {
        return { ok: false, message: "validation.link.phoneInvalid" };
      }

      const hasPlus = cleaned.startsWith("+");
      const digits = digitsOnly(cleaned);
      if (digits.length < 8 || digits.length > 15) {
        return { ok: false, message: "validation.link.phoneInvalid" };
      }

      // Canonical storage: keep international +, drop decorative formatting.
      return { ok: true, value: hasPlus ? `+${digits}` : digits };
    }
    case "email": {
      if (!emailPattern.test(trimmed) || trimmed.length > 254) {
        return { ok: false, message: "validation.link.emailInvalid" };
      }
      return { ok: true, value: trimmed };
    }
    case "whatsapp": {
      if (httpUrlPattern.test(trimmed)) {
        try {
          const url = new URL(trimmed);
          if (!/^https?:$/i.test(url.protocol) || trimmed.length > 2048) {
            return { ok: false, message: "validation.link.urlInvalid" };
          }
          return { ok: true, value: trimmed };
        } catch {
          return { ok: false, message: "validation.link.urlInvalid" };
        }
      }

      const digits = digitsOnly(trimmed);
      if (digits.length < 8 || digits.length > 15) {
        return { ok: false, message: "validation.link.whatsappInvalid" };
      }
      return { ok: true, value: `https://wa.me/${digits}` };
    }
    default: {
      const withScheme = httpUrlPattern.test(trimmed) ? trimmed : `https://${trimmed}`;
      if (withScheme.length > 2048) {
        return { ok: false, message: "validation.link.urlTooLong" };
      }
      try {
        const url = new URL(withScheme);
        if (!/^https?:$/i.test(url.protocol)) {
          return { ok: false, message: "validation.link.urlInvalid" };
        }
      } catch {
        return { ok: false, message: "validation.link.urlInvalid" };
      }
      return { ok: true, value: withScheme };
    }
  }
}

export const createProfileLinkSchema = z
  .object({
    platform: z.enum(MVP_LINK_PLATFORMS, { error: "validation.link.platformInvalid" }),
    value: z.string({ error: "validation.link.valueRequired" }),
    label: z
      .string()
      .trim()
      .max(60, { error: "validation.link.labelTooLong" })
      .optional()
      .transform((value) => (!value || value.length === 0 ? null : value)),
  })
  .superRefine((data, ctx) => {
    const normalized = normalizeLinkValue(data.platform, data.value);
    if (!normalized.ok) {
      ctx.addIssue({ code: "custom", path: ["value"], message: normalized.message });
    }
  })
  .transform((data) => {
    const normalized = normalizeLinkValue(data.platform, data.value);
    if (!normalized.ok) {
      return { platform: data.platform, value: data.value.trim(), label: null };
    }
    return { platform: data.platform, value: normalized.value, label: data.label ?? null };
  });

export const updateProfileLinkSchema = z
  .object({
    id: z.uuid({ error: "validation.link.idInvalid" }),
    value: z.string({ error: "validation.link.valueRequired" }),
    // Existing rows may use a platform outside the MVP picker; still validate
    // the value against that platform's rules so older rows remain editable.
    platform: z.string().min(1, { error: "validation.link.platformInvalid" }),
  })
  .superRefine((data, ctx) => {
    const normalized = normalizeLinkValue(data.platform, data.value);
    if (!normalized.ok) {
      ctx.addIssue({ code: "custom", path: ["value"], message: normalized.message });
    }
  })
  .transform((data) => {
    const normalized = normalizeLinkValue(data.platform, data.value);
    return {
      id: data.id,
      platform: data.platform,
      value: normalized.ok ? normalized.value : data.value.trim(),
    };
  });

export type CreateProfileLinkInput = z.infer<typeof createProfileLinkSchema>;
export type UpdateProfileLinkInput = z.infer<typeof updateProfileLinkSchema>;
