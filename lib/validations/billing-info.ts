import { z } from "zod";

/** Digits-only Turkish tax id: VKN (10) or TCKN (11). */
export function normalizeTaxNumber(value: string): string {
  return value.replace(/\D/g, "");
}

export const billingInfoSchema = z.object({
  companyTitle: z
    .string({ error: "validation.billing.companyTitleRequired" })
    .trim()
    .min(2, { error: "validation.billing.companyTitleTooShort" })
    .max(200, { error: "validation.billing.companyTitleTooLong" }),
  companyAddress: z
    .string({ error: "validation.billing.companyAddressRequired" })
    .trim()
    .min(2, { error: "validation.billing.companyAddressTooShort" })
    .max(500, { error: "validation.billing.companyAddressTooLong" }),
  taxNumber: z
    .string({ error: "validation.billing.taxNumberRequired" })
    .transform(normalizeTaxNumber)
    .pipe(z.string().regex(/^[0-9]{10,11}$/, { error: "validation.billing.taxNumberInvalid" })),
  taxOffice: z
    .string({ error: "validation.billing.taxOfficeRequired" })
    .trim()
    .min(2, { error: "validation.billing.taxOfficeTooShort" })
    .max(120, { error: "validation.billing.taxOfficeTooLong" }),
});

export type BillingInfoInput = z.infer<typeof billingInfoSchema>;
