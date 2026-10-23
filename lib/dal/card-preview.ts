import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { PublicCard } from "@/lib/validations/card";

import { requireUser } from "./auth";

type MaybeVisible = { is_visible?: boolean | null };

/** Rows the owner has hidden stay out of the preview, as they do on the card. */
function visible<T extends MaybeVisible>(row: T | null): T | null {
  return row && row.is_visible !== false ? row : null;
}

/**
 * The owner's card in the same shape get_public_card() returns, built from
 * their own rows (RLS-scoped) so it works before the card is published.
 */
export async function getOwnCardPreview(): Promise<PublicCard | null> {
  const user = await requireUser();
  const supabase = await createClient();

  const [profile, links, skills, documents, bank, billing] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "public_id, full_name, title, company, about, address, avatar_path, theme, locale, skills_section_title",
      )
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("profile_links")
      .select("platform, label, value")
      .eq("profile_id", user.id)
      .eq("is_visible", true)
      .order("display_order")
      .order("created_at"),
    supabase
      .from("profile_skills")
      .select("name, type")
      .eq("profile_id", user.id)
      .order("type")
      .order("display_order"),
    supabase
      .from("documents")
      .select("id, type, title, description, file_name")
      .eq("user_id", user.id)
      .eq("is_visible", true)
      .order("display_order"),
    // select("*") so this keeps working whether or not is_visible exists yet.
    supabase.from("bank_accounts").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("billing_infos").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  if (!profile.data) {
    return null;
  }

  const p = profile.data;
  const bankRow = visible(bank.data as (typeof bank.data & MaybeVisible) | null);
  const billingRow = visible(billing.data as (typeof billing.data & MaybeVisible) | null);

  return {
    publicId: p.public_id,
    fullName: p.full_name,
    title: p.title,
    company: p.company,
    about: p.about,
    address: p.address,
    avatarPath: p.avatar_path,
    theme: p.theme,
    locale: p.locale,
    skillsSectionTitle: p.skills_section_title === "skills" ? "skills" : "expertise_areas",
    bankAccount: bankRow
      ? {
          accountHolder: bankRow.account_holder,
          iban: bankRow.iban,
          bankName: bankRow.bank_name,
        }
      : null,
    billingInfo: billingRow
      ? {
          companyTitle: billingRow.company_title,
          companyAddress: billingRow.company_address,
          taxNumber: billingRow.tax_number,
          taxOffice: billingRow.tax_office,
        }
      : null,
    documents: (documents.data ?? []).map((document) => ({
      id: document.id,
      type: document.type,
      title: document.title,
      description: document.description,
      fileName: document.file_name,
    })),
    links: links.data ?? [],
    skills: (skills.data ?? []).map((skill) => ({
      name: skill.name,
      type: skill.type === "skill" ? "skill" : "expertise",
    })),
  };
}
