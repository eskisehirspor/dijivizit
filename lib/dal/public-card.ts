import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import { isValidVanitySlug } from "@/lib/profile/vanity";
import { isValidPublicId } from "@/lib/utils/public-id";
import { type PublicCard, publicCardSchema } from "@/lib/validations/card";

/**
 * Reads one published card by its public id.
 *
 * Goes through the get_public_card() database function rather than the profiles
 * table: anonymous visitors hold no table grants, so there is no endpoint that
 * can return more than the single card whose id the caller already knows.
 */
export const getPublicCard = cache(async (publicId: string): Promise<PublicCard | null> => {
  const supabase = await createClient();

  // A personal link (/p/gorkem-sonmez) maps to the canonical public id first, so
  // the vCard, events and contact form below keep working on the public id.
  if (!isValidPublicId(publicId) && isValidVanitySlug(publicId.toLowerCase())) {
    const { data: canonical } = await supabase.rpc("public_id_for_slug", {
      p_slug: publicId.toLowerCase(),
    });
    if (typeof canonical !== "string" || !isValidPublicId(canonical)) {
      return null;
    }
    publicId = canonical;
  }

  // Reject malformed ids before spending a round trip, so scanning costs a 404.
  if (!isValidPublicId(publicId)) {
    return null;
  }

  const { data, error } = await supabase.rpc("get_public_card", { p_public_id: publicId });

  if (error || data === null) {
    return null;
  }

  const parsed = publicCardSchema.safeParse(data);

  return parsed.success ? parsed.data : null;
});

/** Builds the public URL for an avatar stored in the `avatars` bucket. */
export async function getAvatarUrl(avatarPath: string | null): Promise<string | null> {
  if (!avatarPath) {
    return null;
  }

  const supabase = await createClient();
  const { data } = supabase.storage.from("avatars").getPublicUrl(avatarPath);

  return data.publicUrl;
}
