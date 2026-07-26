/**
 * Retrieval-augmented generation (RAG) scaffolding.
 *
 * Future home for indexing published card content, retrieving relevant chunks
 * for a query, and composing grounded answers. Depends on `embeddings.ts` and
 * `prompts.ts`; must not touch product UI until a feature ships.
 *
 * No vector store or schema changes are introduced by this placeholder.
 */

/**
 * Indexes (or re-indexes) a published profile for later retrieval.
 * @throws {Error} Always — not implemented.
 */
export async function indexPublicProfile(input: { publicId: string }): Promise<void> {
  void input;
  throw new Error("Not implemented");
}

/**
 * Retrieves the most relevant chunks for a query against a profile index.
 * @throws {Error} Always — not implemented.
 */
export async function retrieveRelevantChunks(input: {
  publicId: string;
  query: string;
  limit?: number;
}): Promise<Array<{ content: string; score: number }>> {
  void input;
  throw new Error("Not implemented");
}

/**
 * Answers a question using retrieved profile context (RAG pipeline).
 * @throws {Error} Always — not implemented.
 */
export async function answerWithRetrieval(input: {
  publicId: string;
  question: string;
}): Promise<string> {
  void input;
  throw new Error("Not implemented");
}
