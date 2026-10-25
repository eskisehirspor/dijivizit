"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { contactSchema, followUpSchema, noteSchema } from "@/lib/contacts/validation";
import {
  addOwnFollowUp,
  addOwnNote,
  createOwnContact,
  deleteOwnContact,
  deleteOwnFollowUp,
  deleteOwnNote,
  setOwnFollowUpDone,
  updateOwnContact,
} from "@/lib/dal/contacts";
import { routes } from "@/lib/routes";

const id = z.uuid();

function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in result)) result[field] = issue.message;
  }
  return result;
}

function readContact(formData: FormData) {
  return contactSchema.safeParse({
    fullName: formData.get("fullName") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    company: formData.get("company") ?? "",
    title: formData.get("title") ?? "",
    metWhere: formData.get("metWhere") ?? "",
    tags: formData.get("tags") ?? "",
  });
}

export async function createContactAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = readContact(formData);
  if (!parsed.success) return failure("contacts.errors.form", fieldErrorsOf(parsed.error));

  const newId = await createOwnContact(parsed.data);
  if (!newId) return failure("contacts.errors.saveFailed");

  revalidatePath(routes.contacts);
  redirect(routes.contact(newId));
}

export async function updateContactAction(
  contactId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!id.safeParse(contactId).success) return failure("contacts.errors.saveFailed");
  const parsed = readContact(formData);
  if (!parsed.success) return failure("contacts.errors.form", fieldErrorsOf(parsed.error));

  const ok = await updateOwnContact(contactId, parsed.data);
  if (!ok) return failure("contacts.errors.saveFailed");

  revalidatePath(routes.contact(contactId));
  revalidatePath(routes.contacts);
  return success();
}

export async function deleteContactAction(contactId: string): Promise<ActionResult> {
  if (!id.safeParse(contactId).success) return failure("contacts.errors.saveFailed");
  const ok = await deleteOwnContact(contactId);
  if (!ok) return failure("contacts.errors.saveFailed");
  revalidatePath(routes.contacts);
  redirect(routes.contacts);
}

export async function addNoteAction(contactId: string, body: string): Promise<ActionResult> {
  if (!id.safeParse(contactId).success) return failure("contacts.errors.saveFailed");
  const parsed = noteSchema.safeParse({ body });
  if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? "contacts.errors.form");
  const ok = await addOwnNote(contactId, parsed.data.body);
  if (!ok) return failure("contacts.errors.saveFailed");
  revalidatePath(routes.contact(contactId));
  return success();
}

export async function deleteNoteAction(contactId: string, noteId: string): Promise<ActionResult> {
  if (!id.safeParse(noteId).success) return failure("contacts.errors.saveFailed");
  const ok = await deleteOwnNote(noteId);
  if (!ok) return failure("contacts.errors.saveFailed");
  revalidatePath(routes.contact(contactId));
  return success();
}

export async function addFollowUpAction(
  contactId: string,
  dueOn: string,
  note: string,
): Promise<ActionResult> {
  if (!id.safeParse(contactId).success) return failure("contacts.errors.saveFailed");
  const parsed = followUpSchema.safeParse({ dueOn, note });
  if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? "contacts.errors.form");
  const ok = await addOwnFollowUp(contactId, parsed.data);
  if (!ok) return failure("contacts.errors.saveFailed");
  revalidatePath(routes.contact(contactId));
  revalidatePath(routes.contacts);
  revalidatePath(routes.dashboard);
  return success();
}

export async function setFollowUpDoneAction(
  contactId: string,
  followUpId: string,
  done: boolean,
): Promise<ActionResult> {
  if (!id.safeParse(followUpId).success || typeof done !== "boolean") {
    return failure("contacts.errors.saveFailed");
  }
  const ok = await setOwnFollowUpDone(followUpId, done);
  if (!ok) return failure("contacts.errors.saveFailed");
  revalidatePath(routes.contact(contactId));
  revalidatePath(routes.contacts);
  revalidatePath(routes.dashboard);
  return success();
}

export async function deleteFollowUpAction(
  contactId: string,
  followUpId: string,
): Promise<ActionResult> {
  if (!id.safeParse(followUpId).success) return failure("contacts.errors.saveFailed");
  const ok = await deleteOwnFollowUp(followUpId);
  if (!ok) return failure("contacts.errors.saveFailed");
  revalidatePath(routes.contact(contactId));
  revalidatePath(routes.contacts);
  return success();
}
