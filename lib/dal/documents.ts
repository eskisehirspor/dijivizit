import "server-only";

import { cache } from "react";

import type { DocumentRow } from "@/lib/db/tables";
import {
  DOCUMENT_LIMIT,
  DOCUMENT_MIME_TYPE,
  DOCUMENTS_BUCKET,
  type DocumentType,
} from "@/lib/profile/documents";
import { createClient } from "@/lib/supabase/server";

import { requireUser } from "./auth";

export type OwnDocument = Pick<
  DocumentRow,
  | "id"
  | "type"
  | "title"
  | "description"
  | "storage_path"
  | "file_name"
  | "mime_type"
  | "file_size"
  | "is_visible"
  | "display_order"
  | "created_at"
  | "updated_at"
>;

const DOCUMENT_COLUMNS =
  "id, type, title, description, storage_path, file_name, mime_type, file_size, is_visible, display_order, created_at, updated_at";

export type DocumentMutationResult =
  { ok: true; document: OwnDocument } | { ok: false; code: "limit" | "upload" | "db" | "unknown" };

export type DocumentDeleteResult = { ok: true } | { ok: false; code: "db" | "unknown" };

export const getOwnDocuments = cache(async (): Promise<OwnDocument[]> => {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .select(DOCUMENT_COLUMNS)
    .eq("user_id", user.id)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load documents: ${error.message}`);
  }

  return data ?? [];
});

export const getOwnDocumentById = cache(async (id: string): Promise<OwnDocument | null> => {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .select(DOCUMENT_COLUMNS)
    .eq("user_id", user.id)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load document: ${error.message}`);
  }

  return data;
});

/** Public URL for a document stored in the documents bucket. */
export async function getDocumentPublicUrl(storagePath: string | null): Promise<string | null> {
  if (!storagePath) {
    return null;
  }

  const supabase = await createClient();
  const { data } = supabase.storage.from(DOCUMENTS_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

/**
 * Uploads a PDF and inserts a documents row.
 * Reuses the same storage path / MIME / size conventions as the previous CV upload.
 */
export async function createOwnDocument(input: {
  file: File;
  type: DocumentType;
  title: string;
  description: string | null;
}): Promise<DocumentMutationResult> {
  const user = await requireUser();
  const supabase = await createClient();
  const existing = await getOwnDocuments();

  if (existing.length >= DOCUMENT_LIMIT) {
    return { ok: false, code: "limit" };
  }

  const nextPath = `${user.id}/${crypto.randomUUID()}.pdf`;
  const fileName = input.file.name.trim() || "belge.pdf";
  const nextOrder =
    existing.length === 0 ? 0 : Math.max(...existing.map((doc) => doc.display_order)) + 1;

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(nextPath, input.file, {
      contentType: DOCUMENT_MIME_TYPE,
      upsert: false,
      cacheControl: "3600",
    });

  if (uploadError) {
    return { ok: false, code: "upload" };
  }

  const { data, error: insertError } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      type: input.type,
      title: input.title,
      description: input.description,
      storage_path: nextPath,
      file_name: fileName,
      mime_type: DOCUMENT_MIME_TYPE,
      file_size: input.file.size,
      is_visible: true,
      display_order: nextOrder,
    })
    .select(DOCUMENT_COLUMNS)
    .single();

  if (insertError || !data) {
    await supabase.storage.from(DOCUMENTS_BUCKET).remove([nextPath]);
    return { ok: false, code: "db" };
  }

  return { ok: true, document: data };
}

export async function updateOwnDocument(input: {
  id: string;
  type: DocumentType;
  title: string;
  description: string | null;
}): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .update({
      type: input.type,
      title: input.title,
      description: input.description,
    })
    .eq("id", input.id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return true;
}

export async function setOwnDocumentVisibility(id: string, isVisible: boolean): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .update({ is_visible: isVisible })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return true;
}

export async function deleteOwnDocument(id: string): Promise<DocumentDeleteResult> {
  const user = await requireUser();
  const supabase = await createClient();

  const existing = await getOwnDocumentById(id);
  if (!existing) {
    return { ok: true };
  }

  const { error: dbError } = await supabase
    .from("documents")
    .delete()
    .eq("id", existing.id)
    .eq("user_id", user.id);

  if (dbError) {
    return { ok: false, code: "db" };
  }

  await supabase.storage.from(DOCUMENTS_BUCKET).remove([existing.storage_path]);
  return { ok: true };
}
