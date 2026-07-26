/**
 * OpenAI provider adapter.
 *
 * Low-level client wrapper for chat, embeddings, and related OpenAI APIs.
 * Keep secrets and SDK usage here; product code should go through `assistant.ts`
 * (or other feature modules), not this file directly.
 *
 * Do not import the OpenAI SDK until an AI feature is approved for ship.
 */

/**
 * Sends a chat completion request to OpenAI.
 * @throws {Error} Always — not implemented.
 */
export async function createChatCompletion(input: {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  model?: string;
}): Promise<string> {
  void input;
  throw new Error("Not implemented");
}

/**
 * Creates an embedding vector for a single text input via OpenAI.
 * @throws {Error} Always — not implemented.
 */
export async function createEmbedding(input: { text: string; model?: string }): Promise<number[]> {
  void input;
  throw new Error("Not implemented");
}
