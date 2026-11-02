"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { ORDER_STATUSES } from "@/lib/admin/orders";
import { setOrderRequestStatus } from "@/lib/dal/admin";
import { routes } from "@/lib/routes";

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(ORDER_STATUSES),
});

export async function updateOrderStatusAction(id: string, status: string): Promise<ActionResult> {
  const parsed = schema.safeParse({ id, status });
  if (!parsed.success) return failure("auth.errors.unknown");
  try {
    await setOrderRequestStatus(parsed.data.id, parsed.data.status);
  } catch {
    return failure("auth.errors.unknown");
  }
  revalidatePath(routes.admin);
  return success();
}
