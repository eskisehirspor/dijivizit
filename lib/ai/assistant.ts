/**
 * High-level AI assistant entry points for Dijivizit.
 *
 * Future home for product-facing AI capabilities (e.g. bio drafting, card
 * copy suggestions, visitor Q&A). Callers should depend on this module rather
 * than provider-specific clients so OpenAI / Gemini / others stay swappable.
 *
 * Not wired into any route, action, or UI yet.
 */

/**
 * Drafts a professional "Hakkımda" bio from profile identity fields.
 * @throws {Error} Always — not implemented.
 */
export async function generateProfileBio(input?: {
  fullName?: string | null;
  title?: string | null;
  company?: string | null;
}): Promise<string> {
  void input;
  throw new Error("Not implemented");
}

/**
 * Suggests short card headline / role copy for the public profile.
 * @throws {Error} Always — not implemented.
 */
export async function suggestCardCopy(input?: {
  fullName?: string | null;
  title?: string | null;
  company?: string | null;
  about?: string | null;
}): Promise<string> {
  void input;
  throw new Error("Not implemented");
}

/**
 * Answers a visitor question using the card owner's published profile context.
 * @throws {Error} Always — not implemented.
 */
export async function answerVisitorQuestion(input: {
  publicId: string;
  question: string;
}): Promise<string> {
  void input;
  throw new Error("Not implemented");
}
