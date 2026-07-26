import { getPublicCard } from "@/lib/dal/public-card";
import { clientEnv } from "@/lib/env/client";
import { routes } from "@/lib/routes";
import { vcardInputFromPublicCard } from "@/lib/share/vcard-from-card";
import { buildVcard30, vcardFilename } from "@/lib/share/vcard";

type RouteContext = {
  params: Promise<{ publicId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { publicId } = await context.params;
  const card = await getPublicCard(publicId);

  if (!card) {
    return new Response("Not Found", { status: 404 });
  }

  const publicUrl = `${clientEnv.NEXT_PUBLIC_SITE_URL}${routes.publicCard(card.publicId)}`;
  const content = buildVcard30(vcardInputFromPublicCard(card, publicUrl));
  const filename = vcardFilename(card.fullName);

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
