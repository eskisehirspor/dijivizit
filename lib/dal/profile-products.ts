import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { ProductInput } from "@/lib/validations/product";

import { requireUser } from "./auth";
import { removeOwnImage, verifyOwnUploadedImage } from "./profile-appearance";

export const MAX_PRODUCTS = 20;

export type OwnProduct = {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  url: string | null;
  imagePath: string | null;
  isVisible: boolean;
};

export async function listOwnProducts(): Promise<OwnProduct[]> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profile_products")
    .select("id, title, description, price, url, image_path, is_visible")
    .eq("profile_id", user.id)
    .order("display_order")
    .order("created_at");
  if (error) throw new Error(`Failed to load products: ${error.message}`);
  return (data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    url: p.url,
    imagePath: p.image_path,
    isVisible: p.is_visible,
  }));
}

export type ProductMutation = { ok: true } | { ok: false; code: "limit" | "image" | "db" };

export async function createOwnProduct(input: ProductInput): Promise<ProductMutation> {
  const user = await requireUser();
  const supabase = await createClient();

  if (input.imagePath && !(await verifyOwnUploadedImage(input.imagePath))) {
    return { ok: false, code: "image" };
  }

  const { count } = await supabase
    .from("profile_products")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", user.id);
  if ((count ?? 0) >= MAX_PRODUCTS) {
    await removeOwnImage(input.imagePath);
    return { ok: false, code: "limit" };
  }

  const { error } = await supabase.from("profile_products").insert({
    profile_id: user.id,
    title: input.title,
    description: input.description,
    price: input.price,
    url: input.url,
    image_path: input.imagePath,
    display_order: count ?? 0,
  });

  if (error) {
    await removeOwnImage(input.imagePath);
    return { ok: false, code: error.code === "23514" ? "limit" : "db" };
  }
  return { ok: true };
}

export async function deleteOwnProduct(id: string): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profile_products")
    .delete()
    .eq("id", id)
    .eq("profile_id", user.id)
    .select("image_path")
    .maybeSingle();
  if (error || !data) return false;
  await removeOwnImage(data.image_path);
  return true;
}

export async function setOwnProductVisible(id: string, visible: boolean): Promise<boolean> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profile_products")
    .update({ is_visible: visible, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("profile_id", user.id)
    .select("id")
    .maybeSingle();
  return !error && Boolean(data);
}
