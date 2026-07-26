import "server-only";

import { cache } from "react";

import type { BillingInfoRow } from "@/lib/db/tables";
import { createClient } from "@/lib/supabase/server";
import type { BillingInfoInput } from "@/lib/validations/billing-info";

import { requireUser } from "./auth";

export type OwnBillingInfo = Pick<
  BillingInfoRow,
  "id" | "company_title" | "company_address" | "tax_number" | "tax_office" | "updated_at"
>;

const BILLING_COLUMNS = "id, company_title, company_address, tax_number, tax_office, updated_at";

export const getOwnBillingInfo = cache(async (): Promise<OwnBillingInfo | null> => {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("billing_infos")
    .select(BILLING_COLUMNS)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load billing info: ${error.message}`);
  }

  return data;
});

export async function upsertOwnBillingInfo(input: BillingInfoInput): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();
  const existing = await getOwnBillingInfo();

  if (existing) {
    const { error } = await supabase
      .from("billing_infos")
      .update({
        company_title: input.companyTitle,
        company_address: input.companyAddress,
        tax_number: input.taxNumber,
        tax_office: input.taxOffice,
      })
      .eq("id", existing.id)
      .eq("user_id", user.id);

    return !error;
  }

  const { error } = await supabase.from("billing_infos").insert({
    user_id: user.id,
    company_title: input.companyTitle,
    company_address: input.companyAddress,
    tax_number: input.taxNumber,
    tax_office: input.taxOffice,
  });

  return !error;
}

export async function deleteOwnBillingInfo(): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase.from("billing_infos").delete().eq("user_id", user.id);

  return !error;
}
