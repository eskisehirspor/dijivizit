/**
 * Personal card links: dijivizit.com/p/<vanity>. Mirrors the
 * profiles_vanity_slug_format check; eleven characters is excluded so a vanity
 * slug can never be mistaken for (or shadow) a public id.
 */
const VANITY_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export const VANITY_MIN = 3;
export const VANITY_MAX = 40;

const TR_MAP: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  i̇: "i",
  ö: "o",
  ş: "s",
  ü: "u",
};

/** "Görkem Sönmez" -> "gorkem-sonmez". Used to suggest and to clean input. */
export function toVanitySlug(input: string): string {
  return input
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıöşü]|i̇/g, (c) => TR_MAP[c] ?? c)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, VANITY_MAX)
    .replace(/-+$/g, "");
}

export function isValidVanitySlug(value: string): boolean {
  return (
    value.length >= VANITY_MIN &&
    value.length <= VANITY_MAX &&
    value.length !== 11 &&
    VANITY_PATTERN.test(value) &&
    !value.includes("--")
  );
}
