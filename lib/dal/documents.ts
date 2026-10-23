import "server-only";

import { cache } from "react";

import type { DocumentRow } from "@/lib/db/tables";
import {
  DOCUMENT_LIMIT,
  DOCUMENT_MAX_BYTES,
  DOCUMENT_MIME_TYPE,
  DOCUMENTS_BUCKET,
  type DocumentType,
} from "@/lib/profile/documents";
import { createAdminClient } from "@/lib/supabase/admin";
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

const SIGNED_URL_TTL_SECONDS = 120;

/**
 * Short-lived URL for a document object. The bucket is private, so this is the
 * only way a file leaves storage; callers must authorize the request first.
 */
export async function createDocumentSignedUrl(storagePath: string): Promise<string | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);

  return error || !data ? null : data.signedUrl;
}

/** Storage path of a visible document on a published card, or null. */
export async function getPublishedDocumentPath(
  publicId: string,
  documentId: string,
): Promise<string | null> {
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("public_id", publicId)
    .eq("is_published", true)
    .maybeSingle();

  if (!profile) {
    return null;
  }

  const { data } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("id", documentId)
    .eq("user_id", profile.id)
    .eq("is_visible", true)
    .maybeSingle();

  return data?.storage_path ?? null;
}

const UPLOAD_PATH_PATTERN =
  /^([0-9a-f-]{36})\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pdf$/;

export type DocumentUploadSlot = { ok: true; path: string } | { ok: false; code: "limit" };

/**
 * Reserves a storage path for a browser-side upload. Files go straight from the
 * browser to Storage (owner-folder RLS) so they never pass through a server
 * function's request-size limit.
 */
export async function reserveOwnDocumentUpload(): Promise<DocumentUploadSlot> {
  const user = await requireUser();
  const existing = await getOwnDocuments();

  if (existing.length >= DOCUMENT_LIMIT) {
    return { ok: false, code: "limit" };
  }

  return { ok: true, path: `${user.id}/${crypto.randomUUID()}.pdf` };
}

/**
 * Registers an object the browser already uploaded. Size and type are read back
 * from Storage rather than trusted from the client.
 */
export async function finalizeOwnDocument(input: {
  path: string;
  fileName: string;
  type: DocumentType;
  title: string;
  description: string | null;
}): Promise<DocumentMutationResult> {
  const user = await requireUser();
  const admin = createAdminClient();

  const match = UPLOAD_PATH_PATTERN.exec(input.path);
  if (!match || match[1] !== user.id) {
    return { ok: false, code: "upload" };
  }

  const discard = async () => {
    await admin.storage.from(DOCUMENTS_BUCKET).remove([input.path]);
  };

  const { data: object, error: infoError } = await admin.storage
    .from(DOCUMENTS_BUCKET)
    .info(input.path);

  if (infoError || !object) {
    return { ok: false, code: "upload" };
  }

  const size = object.size ?? 0;
  if (size <= 0 || size > DOCUMENT_MAX_BYTES || object.contentType !== DOCUMENT_MIME_TYPE) {
    await discard();
    return { ok: false, code: "upload" };
  }

  const existing = await getOwnDocuments();
  if (existing.length >= DOCUMENT_LIMIT) {
    await discard();
    return { ok: false, code: "limit" };
  }

  const supabase = await createClient();
  const nextOrder =
    existing.length === 0 ? 0 : Math.max(...existing.map((doc) => doc.display_order)) + 1;

  const { data, error: insertError } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      type: input.type,
      title: input.title,
      description: input.description,
      storage_path: input.path,
      file_name: input.fileName.trim().slice(0, 255) || "belge.pdf",
      mime_type: DOCUMENT_MIME_TYPE,
      file_size: size,
      is_visible: true,
      display_order: nextOrder,
    })
    .select(DOCUMENT_COLUMNS)
    .single();

  if (insertError || !data) {
    // 23505: this path is already registered (a replayed finalize). The object
    // belongs to that existing row, so it must not be deleted.
    if (insertError?.code !== "23505") {
      await discard();
    }
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
