/**
 * Embedding helpers shared across providers.
 *
 * Normalize text, choose chunking strategy, and route to `openai.ts` /
 * `gemini.ts` from here. Vector storage / retrieval belongs in `rag.ts`.
 */

/**
 * Embeds a single string into a dense vector (provider-agnostic entry point).
 * @throws {Error} Always — not implemented.
 */
export async function embedText(input: {
  text: string;
  provider?: "openai" | "gemini";
}): Promise<number[]> {
  void input;
  throw new Error("Not implemented");
}

/**
 * Splits long profile / knowledge text into embedding-sized chunks.
 * @throws {Error} Always — not implemented.
 */
export function chunkTextForEmbedding(input: { text: string; maxTokens?: number }): string[] {
  void input;
  throw new Error("Not implemented");
}
