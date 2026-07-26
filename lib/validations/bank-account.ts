import { z } from "zod";

import { detectTurkishBankName, normalizeIban } from "@/lib/bank/turkish-iban";

const ibanPattern = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/;

export const bankAccountSchema = z
  .object({
    accountHolder: z
      .string({ error: "validation.bank.accountHolderRequired" })
      .trim()
      .min(2, { error: "validation.bank.accountHolderTooShort" })
      .max(120, { error: "validation.bank.accountHolderTooLong" }),
    iban: z.string({ error: "validation.bank.ibanRequired" }),
    bankName: z
      .string({ error: "validation.bank.bankNameRequired" })
      .trim()
      .max(120, { error: "validation.bank.bankNameTooLong" })
      .optional()
      .transform((value) => (value && value.length > 0 ? value : null)),
  })
  .superRefine((data, ctx) => {
    const iban = normalizeIban(data.iban);
    if (!ibanPattern.test(iban)) {
      ctx.addIssue({
        code: "custom",
        path: ["iban"],
        message: "validation.bank.ibanInvalid",
      });
      return;
    }

    const detected = detectTurkishBankName(iban);
    const manual = data.bankName;
    if (!detected && !manual) {
      ctx.addIssue({
        code: "custom",
        path: ["bankName"],
        message: "validation.bank.bankNameRequired",
      });
    }
  })
  .transform((data) => {
    const iban = normalizeIban(data.iban);
    const detected = detectTurkishBankName(iban);
    return {
      accountHolder: data.accountHolder,
      iban,
      bankName: detected ?? data.bankName!,
    };
  });

export type BankAccountInput = z.infer<typeof bankAccountSchema>;
