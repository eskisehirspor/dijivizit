"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { deleteOwnBankAccount, upsertOwnBankAccount } from "@/lib/dal/bank-accounts";
import { getOwnProfile } from "@/lib/dal/profile";
import { routes } from "@/lib/routes";
import { bankAccountSchema } from "@/lib/validations/bank-account";

function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === "string" && !(field in result)) {
      result[field] = issue.message;
    }
  }

  return result;
}

async function revalidateBankPaths() {
  revalidatePath(routes.profileBank);
  revalidatePath(routes.dashboard);

  const profile = await getOwnProfile();
  if (profile?.public_id) {
    revalidatePath(routes.publicCard(profile.public_id));
  }
}

export async function upsertBankAccountAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = bankAccountSchema.safeParse({
    accountHolder: formData.get("accountHolder"),
    iban: formData.get("iban"),
    bankName: formData.get("bankName"),
  });

  if (!parsed.success) {
    return failure("profile.bank.errors.saveFailed", fieldErrorsOf(parsed.error));
  }

  const ok = await upsertOwnBankAccount(parsed.data);
  if (!ok) {
    return failure("profile.bank.errors.saveFailed");
  }

  await revalidateBankPaths();
  return success();
}

export async function deleteBankAccountAction(): Promise<ActionResult> {
  const ok = await deleteOwnBankAccount();
  if (!ok) {
    return failure("profile.bank.errors.deleteFailed");
  }

  await revalidateBankPaths();
  return success();
}
