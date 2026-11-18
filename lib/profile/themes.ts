/**
 * Colour themes for the public card. profiles.theme stores the id; an unknown
 * id renders as "default", so removing a theme here never breaks a card.
 *
 * Each theme only sets the accent (the "Rehberime Kaydet" button and the icon
 * chips) and whether the card is dark; layout and typography stay the same.
 */
export const CARD_THEMES = [
  { id: "default", accent: "#171717", accentText: "#fafafa", dark: false },
  { id: "navy", accent: "#1e3a8a", accentText: "#ffffff", dark: false },
  { id: "emerald", accent: "#047857", accentText: "#ffffff", dark: false },
  { id: "burgundy", accent: "#9f1239", accentText: "#ffffff", dark: false },
  { id: "orange", accent: "#c2410c", accentText: "#ffffff", dark: false },
  { id: "violet", accent: "#6d28d9", accentText: "#ffffff", dark: false },
  { id: "gold", accent: "#a16207", accentText: "#ffffff", dark: false },
  { id: "night", accent: "#fafafa", accentText: "#0a0a0a", dark: true },
  { id: "night-gold", accent: "#d4a537", accentText: "#0a0a0a", dark: true },
] as const;

export type CardTheme = (typeof CARD_THEMES)[number];
export type CardThemeId = CardTheme["id"];

export function isCardThemeId(value: string): value is CardThemeId {
  return CARD_THEMES.some((t) => t.id === value);
}

export function cardTheme(id: string): CardTheme {
  return CARD_THEMES.find((t) => t.id === id) ?? CARD_THEMES[0];
}
