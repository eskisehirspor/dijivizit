"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { type ActionResult, failure, success } from "@/lib/action-result";
import { insertInvitationCode, requireInviteOwner } from "@/lib/dal/invitations";
import { routes } from "@/lib/routes";
import { createInvitationSchema, parseInvitationExpiry } from "@/lib/validations/invitations";

export type CreateInvitationData = {
  plaintext: string;
};

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

export async function createInvitationAction(
  _previous: ActionResult<CreateInvitationData> | null,
  formData: FormData,
): Promise<ActionResult<CreateInvitationData>> {
  const owner = await requireInviteOwner();

  const parsed = createInvitationSchema.safeParse({
    email: formData.get("email") ?? "",
    maxUses: formData.get("maxUses") ?? "1",
    expiresAt: formData.get("expiresAt") ?? "",
  });

  if (!parsed.success) {
    return failure("auth.errors.unknown", fieldErrorsOf(parsed.error));
  }

  const expiresAt = parseInvitationExpiry(parsed.data.expiresAt);

  if (expiresAt !== null && typeof expiresAt === "object") {
    return failure("dashboard.invites.errors.expiresAt", {
      expiresAt: "dashboard.invites.errors.expiresAt",
    });
  }

  const result = await insertInvitationCode({
    createdBy: owner.id,
    email: parsed.data.email === "" ? null : parsed.data.email,
    maxUses: parsed.data.maxUses,
    expiresAt,
  });

  if ("error" in result) {
    return failure("dashboard.invites.errors.createFailed");
  }

  revalidatePath(routes.invites);
  return success({ plaintext: result.plaintext });
}
