"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { createCard, deleteCard, updateCard } from "@/lib/dal/cards";
import { routes } from "@/lib/routes";

const id = z.uuid();
const label = z
  .string()
  .trim()
  .max(60, { error: "cards.errors.label" })
  .transform((v) => v || null);

function refresh() {
  revalidatePath(routes.cards);
  revalidatePath(routes.team);
}

export async function createCardAction(
  rawLabel: string,
  orgId?: string,
  count?: number,
): Promise<ActionResult> {
  const parsed = label.safeParse(rawLabel ?? "");
  if (!parsed.success) return failure("cards.errors.label");
  if (orgId !== undefined && !id.safeParse(orgId).success) return failure("cards.errors.failed");
  const n = z
    .number()
    .int()
    .min(1)
    .max(50)
    .safeParse(count ?? 1);
  if (!n.success) return failure("cards.errors.count");
  const ok = await createCard({ label: parsed.data, orgId, count: n.data });
  if (!ok) return failure("cards.errors.limit");
  refresh();
  return success();
}

export async function renameCardAction(cardId: string, rawLabel: string): Promise<ActionResult> {
  const parsed = label.safeParse(rawLabel ?? "");
  if (!id.safeParse(cardId).success || !parsed.success) return failure("cards.errors.label");
  if (!(await updateCard(cardId, { label: parsed.data }))) return failure("cards.errors.failed");
  refresh();
  return success();
}

export async function setCardActiveAction(cardId: string, active: boolean): Promise<ActionResult> {
  if (!id.safeParse(cardId).success || typeof active !== "boolean") {
    return failure("cards.errors.failed");
  }
  if (!(await updateCard(cardId, { is_active: active }))) return failure("cards.errors.failed");
  refresh();
  return success();
}

export async function assignCardAction(
  cardId: string,
  userId: string | null,
): Promise<ActionResult> {
  if (!id.safeParse(cardId).success || (userId !== null && !id.safeParse(userId).success)) {
    return failure("cards.errors.failed");
  }
  if (!(await updateCard(cardId, { assigned_to: userId }))) return failure("cards.errors.failed");
  refresh();
  return success();
}

export async function deleteCardAction(cardId: string): Promise<ActionResult> {
  if (!id.safeParse(cardId).success) return failure("cards.errors.failed");
  if (!(await deleteCard(cardId))) return failure("cards.errors.failed");
  refresh();
  return success();
}
