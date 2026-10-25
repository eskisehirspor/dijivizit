import "server-only";

import type { ContactNoteRow, ContactRow, FollowUpRow } from "@/lib/db/tables";
import type { ContactInput } from "@/lib/contacts/validation";
import { createClient } from "@/lib/supabase/server";

import { requireUser } from "./auth";

export type ContactListItem = Pick<
  ContactRow,
  "id" | "full_name" | "company" | "title" | "phone" | "email" | "tags" | "source" | "created_at"
> & { nextFollowUp: string | null };

export type ContactDetail = ContactRow & {
  notes: Pick<ContactNoteRow, "id" | "body" | "created_at">[];
  followUps: Pick<FollowUpRow, "id" | "due_on" | "note" | "done_at">[];
};

const LIST_COLUMNS = "id, full_name, company, title, phone, email, tags, source, created_at";

/** PostgREST `or` filters are comma separated; strip anything that could break the syntax. */
function searchTerm(raw: string): string {
  return raw
    .replace(/[,()*%\\]/g, " ")
    .trim()
    .slice(0, 60);
}

export async function listOwnContacts(filter: {
  q?: string;
  tag?: string;
}): Promise<ContactListItem[]> {
  const user = await requireUser();
  const supabase = await createClient();

  let query = supabase
    .from("contacts")
    .select(LIST_COLUMNS)
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false })
    .limit(500);

  const q = searchTerm(filter.q ?? "");
  if (q) {
    query = query.or(
      `full_name.ilike.*${q}*,company.ilike.*${q}*,email.ilike.*${q}*,phone.ilike.*${q}*`,
    );
  }
  if (filter.tag) query = query.contains("tags", [filter.tag]);

  const [{ data, error }, { data: due }] = await Promise.all([
    query,
    supabase
      .from("follow_ups")
      .select("contact_id, due_on")
      .eq("profile_id", user.id)
      .is("done_at", null)
      .order("due_on", { ascending: true }),
  ]);

  if (error) {
    console.error("listOwnContacts failed:", error.message);
    return [];
  }

  const next = new Map<string, string>();
  for (const row of due ?? []) if (!next.has(row.contact_id)) next.set(row.contact_id, row.due_on);

  return (data ?? []).map((row) => ({ ...row, nextFollowUp: next.get(row.id) ?? null }));
}

export async function listOwnContactsForExport() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("contacts")
    .select("full_name, phone, email, company, title, met_where, tags, message, source, created_at")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5000);
  return data ?? [];
}

export async function listOwnTags(): Promise<string[]> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("contacts")
    .select("tags")
    .eq("profile_id", user.id)
    .limit(5000);
  const tags = new Set<string>();
  for (const row of data ?? []) for (const tag of row.tags) tags.add(tag);
  return [...tags].sort((a, b) => a.localeCompare(b, "tr"));
}

export async function getOwnContact(id: string): Promise<ContactDetail | null> {
  const user = await requireUser();
  const supabase = await createClient();

  const [{ data: contact }, { data: notes }, { data: followUps }] = await Promise.all([
    supabase.from("contacts").select("*").eq("id", id).eq("profile_id", user.id).maybeSingle(),
    supabase
      .from("contact_notes")
      .select("id, body, created_at")
      .eq("contact_id", id)
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("follow_ups")
      .select("id, due_on, note, done_at")
      .eq("contact_id", id)
      .eq("profile_id", user.id)
      .order("due_on", { ascending: true }),
  ]);

  if (!contact) return null;
  return { ...contact, notes: notes ?? [], followUps: followUps ?? [] };
}

/** Open follow-ups due today or earlier, for the dashboard. */
export async function listOwnDueFollowUps(today: string) {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("follow_ups")
    .select("id, due_on, note, contact_id, contacts(full_name)")
    .eq("profile_id", user.id)
    .is("done_at", null)
    .lte("due_on", today)
    .order("due_on", { ascending: true })
    .limit(20);
  return (data ?? []).map((row) => ({
    id: row.id,
    dueOn: row.due_on,
    note: row.note,
    contactId: row.contact_id,
    contactName: row.contacts?.full_name ?? "",
  }));
}

function toRow(input: ContactInput) {
  return {
    full_name: input.fullName,
    phone: input.phone,
    email: input.email,
    company: input.company,
    title: input.title,
    met_where: input.metWhere,
    tags: input.tags,
  };
}

export async function createOwnContact(input: ContactInput): Promise<string | null> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .insert({ ...toRow(input), profile_id: user.id, source: "manual" })
    .select("id")
    .single();
  if (error) console.error("createOwnContact failed:", error.message);
  return data?.id ?? null;
}

export async function updateOwnContact(id: string, input: ContactInput): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("contacts")
    .update(toRow(input))
    .eq("id", id)
    .eq("profile_id", user.id);
  return !error;
}

export async function deleteOwnContact(id: string): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").delete().eq("id", id).eq("profile_id", user.id);
  return !error;
}

export async function addOwnNote(contactId: string, body: string): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_notes")
    .insert({ contact_id: contactId, profile_id: user.id, body });
  return !error;
}

export async function deleteOwnNote(id: string): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_notes")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);
  return !error;
}

export async function addOwnFollowUp(
  contactId: string,
  input: { dueOn: string; note: string | null },
): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("follow_ups")
    .insert({ contact_id: contactId, profile_id: user.id, due_on: input.dueOn, note: input.note });
  return !error;
}

export async function setOwnFollowUpDone(id: string, done: boolean): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("follow_ups")
    .update({ done_at: done ? new Date().toISOString() : null })
    .eq("id", id)
    .eq("profile_id", user.id);
  return !error;
}

export async function deleteOwnFollowUp(id: string): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("follow_ups")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id);
  return !error;
}
