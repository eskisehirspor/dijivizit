import { getAuthenticatedUser } from "@/lib/dal/auth";
import { getOwnProfile } from "@/lib/dal/profile";
import { getPublicCard } from "@/lib/dal/public-card";
import { clientEnv } from "@/lib/env/client";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import { isValidPublicId } from "@/lib/utils/public-id";
import { buildPkpass, getAppleWalletConfig } from "@/lib/wallet/apple";

/** The signed-in owner's card as an Apple Wallet pass (personal link or a card they hold). */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getAuthenticatedUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  if (!isValidPublicId(slug)) return new Response("Not found", { status: 404 });

  const profile = await getOwnProfile();
  let owns = profile?.public_id === slug;
  if (!owns) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("cards")
      .select("id")
      .eq("slug", slug)
      .eq("assigned_to", user.id)
      .eq("is_active", true)
      .maybeSingle();
    owns = Boolean(data);
  }
  if (!owns) return new Response("Not found", { status: 404 });

  const [config, card] = await Promise.all([getAppleWalletConfig(), getPublicCard(slug)]);
  if (!config) return new Response("Wallet is not configured", { status: 503 });
  if (!card) return new Response("Publish your card first", { status: 409 });

  const phone = card.links.find((l) => l.platform === "phone")?.value ?? null;
  const email = card.links.find((l) => l.platform === "email")?.value ?? null;
  const pkpass = buildPkpass(
    {
      slug,
      url: `${clientEnv.NEXT_PUBLIC_SITE_URL}${routes.publicCard(slug)}`,
      fullName: card.fullName ?? "Dijivizit",
      title: card.title,
      company: card.company,
      phone,
      email,
    },
    config,
  );

  return new Response(new Blob([pkpass as Uint8Array<ArrayBuffer>]), {
    headers: {
      "Content-Type": "application/vnd.apple.pkpass",
      "Content-Disposition": `attachment; filename="dijivizit-${slug}.pkpass"`,
      "Cache-Control": "private, no-store",
    },
  });
}
