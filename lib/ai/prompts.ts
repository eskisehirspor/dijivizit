/**
 * Prompt templates and builders for Dijivizit AI features.
 *
 * Centralise system / user prompt strings here so copy, locale, and safety
 * instructions stay versioned in one place instead of being inlined in
 * provider adapters or server actions.
 */

/**
 * Builds the system + user prompts for profile bio generation.
 * @throws {Error} Always — not implemented.
 */
export function buildProfileBioPrompt(input: {
  fullName?: string | null;
  title?: string | null;
  company?: string | null;
  locale?: string;
}): { system: string; user: string } {
  void input;
  throw new Error("Not implemented");
}

/**
 * Builds prompts for answering a visitor question about a published card.
 * @throws {Error} Always — not implemented.
 */
export function buildVisitorAnswerPrompt(input: {
  profileContext: string;
  question: string;
  locale?: string;
}): { system: string; user: string } {
  void input;
  throw new Error("Not implemented");
}
