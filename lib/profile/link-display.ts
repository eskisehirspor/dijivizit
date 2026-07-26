import { isUsernamePlatform } from "@/lib/profile/platforms";
import { extractUsername } from "@/lib/validations/profile-links";

/**
 * Human-readable secondary line for a public card link (username, email,
 * phone, or domain). Returns null when nothing useful can be shown.
 */
export function displayValueForPublicLink(platform: string, value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (isUsernamePlatform(platform)) {
    const username = extractUsername(platform, trimmed);
    if (!username) {
      return null;
    }
    return platform === "linkedin" ? username : `@${username}`;
  }

  switch (platform) {
    case "phone":
    case "email":
      return trimmed;
    case "address":
      return trimmed;
    case "whatsapp": {
      try {
        const url = new URL(trimmed);
        if (url.hostname.replace(/^www\./, "") === "wa.me") {
          const digits = url.pathname.replace(/\D/g, "");
          return digits ? `+${digits}` : null;
        }
      } catch {
        // Fall through.
      }
      return trimmed;
    }
    default: {
      try {
        const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
        const url = new URL(withScheme);
        return url.hostname.replace(/^www\./, "") || null;
      } catch {
        return trimmed;
      }
    }
  }
}
