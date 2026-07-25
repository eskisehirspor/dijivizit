/**
 * Platforms offered in the MVP link picker. The database still accepts a wider
 * set (github, facebook, youtube, tiktok, behance, dribbble, telegram, custom);
 * those stay schema-ready for later releases and are intentionally omitted here.
 */
export const MVP_LINK_PLATFORMS = [
  "phone",
  "email",
  "website",
  "linkedin",
  "instagram",
  "x",
  "whatsapp",
] as const;

export type MvpLinkPlatform = (typeof MVP_LINK_PLATFORMS)[number];

export const PROFILE_LINK_LIMIT = 20;

/** Social platforms that store a full URL but only collect a username in the UI. */
export const USERNAME_PLATFORM_PREFIXES = {
  instagram: "https://www.instagram.com/",
  linkedin: "https://www.linkedin.com/in/",
  x: "https://x.com/",
} as const;

export type UsernamePlatform = keyof typeof USERNAME_PLATFORM_PREFIXES;

export function isMvpLinkPlatform(value: string): value is MvpLinkPlatform {
  return (MVP_LINK_PLATFORMS as readonly string[]).includes(value);
}

export function isUsernamePlatform(value: string): value is UsernamePlatform {
  return value in USERNAME_PLATFORM_PREFIXES;
}
