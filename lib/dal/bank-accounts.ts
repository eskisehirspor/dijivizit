import "server-only";

import { cache } from "react";

import type { BankAccountRow } from "@/lib/db/tables";
import { createClient } from "@/lib/supabase/server";
import type { BankAccountInput } from "@/lib/validations/bank-account";

import { requireUser } from "./auth";

export type OwnBankAccount = Pick<
  BankAccountRow,
  "id" | "account_holder" | "iban" | "bank_name" | "is_visible" | "updated_at"
>;

const BANK_COLUMNS = "id, account_holder, iban, bank_name, is_visible, updated_at";

export const getOwnBankAccount = cache(async (): Promise<OwnBankAccount | null> => {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bank_accounts")
    .select(BANK_COLUMNS)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load bank account: ${error.message}`);
  }

  return data;
});

/**
 * Creates or updates the owner's single bank account row.
 * Unique(user_id) enforces one row for now; multiples come later by dropping it.
 */
export async function upsertOwnBankAccount(input: BankAccountInput): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();
  const existing = await getOwnBankAccount();

  if (existing) {
    const { error } = await supabase
      .from("bank_accounts")
      .update({
        account_holder: input.accountHolder,
        iban: input.iban,
        bank_name: input.bankName,
      })
      .eq("id", existing.id)
      .eq("user_id", user.id);

    return !error;
  }

  const { error } = await supabase.from("bank_accounts").insert({
    user_id: user.id,
    account_holder: input.accountHolder,
    iban: input.iban,
    bank_name: input.bankName,
  });

  return !error;
}

export async function deleteOwnBankAccount(): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase.from("bank_accounts").delete().eq("user_id", user.id);

  return !error;
}

/** Keeps the IBAN on file but shows or hides it on the public card. */
export async function setOwnBankAccountVisibility(isVisible: boolean): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("bank_accounts")
    .update({ is_visible: isVisible })
    .eq("user_id", user.id);

  return !error;
}
