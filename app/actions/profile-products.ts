"use server";

import { revalidatePath } from "next/cache";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { getOwnAppearance } from "@/lib/dal/profile-appearance";
import {
  createOwnProduct,
  deleteOwnProduct,
  setOwnProductVisible,
} from "@/lib/dal/profile-products";
import { getOwnProfile } from "@/lib/dal/profile";
import { routes } from "@/lib/routes";
import { productSchema } from "@/lib/validations/product";

async function revalidateProducts() {
  revalidatePath(routes.profileProducts);
  revalidatePath(routes.cardPreview);
  const [profile, appearance] = await Promise.all([getOwnProfile(), getOwnAppearance()]);
  if (profile?.public_id) revalidatePath(routes.publicCard(profile.public_id));
  if (appearance?.vanitySlug) revalidatePath(routes.publicCard(appearance.vanitySlug));
}

export async function createProductAction(input: {
  title: string;
  description: string;
  price: string;
  url: string;
  imagePath: string;
}): Promise<ActionResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !(field in fieldErrors)) fieldErrors[field] = issue.message;
    }
    return failure("profile.products.errors.saveFailed", fieldErrors);
  }

  const result = await createOwnProduct(parsed.data);
  if (!result.ok) return failure(`profile.products.errors.${result.code}`);

  await revalidateProducts();
  return success();
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  if (!(await deleteOwnProduct(id))) return failure("profile.products.errors.deleteFailed");
  await revalidateProducts();
  return success();
}

export async function toggleProductVisibilityAction(
  id: string,
  visible: boolean,
): Promise<ActionResult> {
  if (!(await setOwnProductVisible(id, visible))) {
    return failure("profile.products.errors.saveFailed");
  }
  await revalidateProducts();
  return success();
}
