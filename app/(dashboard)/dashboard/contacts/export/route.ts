import { contactsToCsv, istanbulToday } from "@/lib/contacts/format";
import { getAuthenticatedUser } from "@/lib/dal/auth";
import { listOwnContactsForExport } from "@/lib/dal/contacts";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const rows = await listOwnContactsForExport();
  return new Response(contactsToCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dijivizit-kisiler-${istanbulToday()}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
