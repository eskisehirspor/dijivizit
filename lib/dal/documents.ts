import "server-only";

import { cache } from "react";

import type { DocumentRow } from "@/lib/db/tables";
import { CV_DOCUMENT_TYPE, CV_MIME_TYPE, DOCUMENTS_BUCKET } from "@/lib/profile/documents";
import { createClient } from "@/lib/supabase/server";

import { requireUser } from "./auth";

export type OwnCvDocument = Pick<
  DocumentRow,
  | "id"
  | "title"
  | "storage_path"
  | "file_name"
  | "mime_type"
  | "file_size"
  | "created_at"
  | "updated_at"
>;

const CV_COLUMNS =
  "id, title, storage_path, file_name, mime_type, file_size, created_at, updated_at";

export type CvMutationResult =
  { ok: true; document: OwnCvDocument } | { ok: false; code: "upload" | "db" | "unknown" };

export type CvDeleteResult = { ok: true } | { ok: false; code: "db" | "unknown" };

export const getOwnCvDocument = cache(async (): Promise<OwnCvDocument | null> => {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .select(CV_COLUMNS)
    .eq("user_id", user.id)
    .eq("type", CV_DOCUMENT_TYPE)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load CV document: ${error.message}`);
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
 * Uploads a CV PDF and upserts the single documents row for type=cv.
 * Replacing deletes the previous storage object after the DB points at the new path.
 */
export async function uploadOwnCv(file: File): Promise<CvMutationResult> {
  const user = await requireUser();
  const supabase = await createClient();
  const existing = await getOwnCvDocument();

  const nextPath = `${user.id}/${crypto.randomUUID()}.pdf`;
  const fileName = file.name.trim() || "ozgecmis.pdf";
  const title = "Özgeçmiş";

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(nextPath, file, {
      contentType: CV_MIME_TYPE,
      upsert: false,
      cacheControl: "3600",
    });

  if (uploadError) {
    return { ok: false, code: "upload" };
  }

  if (existing) {
    const { data, error: dbError } = await supabase
      .from("documents")
      .update({
        title,
        storage_path: nextPath,
        file_name: fileName,
        mime_type: CV_MIME_TYPE,
        file_size: file.size,
      })
      .eq("id", existing.id)
      .eq("user_id", user.id)
      .select(CV_COLUMNS)
      .single();

    if (dbError || !data) {
      await supabase.storage.from(DOCUMENTS_BUCKET).remove([nextPath]);
      return { ok: false, code: "db" };
    }

    if (existing.storage_path !== nextPath) {
      await supabase.storage.from(DOCUMENTS_BUCKET).remove([existing.storage_path]);
    }

    return { ok: true, document: data };
  }

  const { data, error: insertError } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      type: CV_DOCUMENT_TYPE,
      title,
      storage_path: nextPath,
      file_name: fileName,
      mime_type: CV_MIME_TYPE,
      file_size: file.size,
    })
    .select(CV_COLUMNS)
    .single();

  if (insertError || !data) {
    await supabase.storage.from(DOCUMENTS_BUCKET).remove([nextPath]);
    return { ok: false, code: "db" };
  }

  return { ok: true, document: data };
}

export async function deleteOwnCv(): Promise<CvDeleteResult> {
  const user = await requireUser();
  const supabase = await createClient();
  const existing = await getOwnCvDocument();

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
