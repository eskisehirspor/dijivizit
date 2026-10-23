"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import {
  deleteOwnBillingInfo,
  setOwnBillingInfoVisibility,
  upsertOwnBillingInfo,
} from "@/lib/dal/billing-infos";
import { getOwnProfile } from "@/lib/dal/profile";
import { routes } from "@/lib/routes";
import { billingInfoSchema } from "@/lib/validations/billing-info";

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

async function revalidateBillingPaths() {
  revalidatePath(routes.profileBilling);
  revalidatePath(routes.dashboard);

  const profile = await getOwnProfile();
  if (profile?.public_id) {
    revalidatePath(routes.publicCard(profile.public_id));
  }
}

export async function upsertBillingInfoAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = billingInfoSchema.safeParse({
    companyTitle: formData.get("companyTitle"),
    companyAddress: formData.get("companyAddress"),
    taxNumber: formData.get("taxNumber"),
    taxOffice: formData.get("taxOffice"),
  });

  if (!parsed.success) {
    return failure("profile.billing.errors.saveFailed", fieldErrorsOf(parsed.error));
  }

  const ok = await upsertOwnBillingInfo(parsed.data);
  if (!ok) {
    return failure("profile.billing.errors.saveFailed");
  }

  await revalidateBillingPaths();
  return success();
}

export async function deleteBillingInfoAction(): Promise<ActionResult> {
  const ok = await deleteOwnBillingInfo();
  if (!ok) {
    return failure("profile.billing.errors.deleteFailed");
  }

  await revalidateBillingPaths();
  return success();
}

export async function setBillingInfoVisibilityAction(isVisible: boolean): Promise<ActionResult> {
  const ok = await setOwnBillingInfoVisibility(isVisible);
  if (!ok) {
    return failure("profile.cardVisibility.failed");
  }

  await revalidateBillingPaths();
  return success();
}
