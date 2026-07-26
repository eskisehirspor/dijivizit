/**
 * Google Gemini provider adapter.
 *
 * Low-level client wrapper for Gemini generation and embedding APIs.
 * Mirror of `openai.ts` so the assistant layer can switch providers without
 * touching product call sites.
 *
 * Do not import the Gemini SDK until an AI feature is approved for ship.
 */

/**
 * Generates text with Gemini.
 * @throws {Error} Always — not implemented.
 */
export async function generateContent(input: { prompt: string; model?: string }): Promise<string> {
  void input;
  throw new Error("Not implemented");
}

/**
 * Creates an embedding vector for a single text input via Gemini.
 * @throws {Error} Always — not implemented.
 */
export async function embedContent(input: { text: string; model?: string }): Promise<number[]> {
  void input;
  throw new Error("Not implemented");
}
