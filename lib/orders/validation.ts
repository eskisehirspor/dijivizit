import { z } from "zod";

import { FINISH_IDS } from "@/lib/orders/finishes";

/** Turkish mobile or landline, any common spelling: 0540 626 19 65,
 * +90 540 626 1965, 5406261965. Normalised to +90XXXXXXXXXX. */
export function normalizeTurkishPhone(raw: string): string | null {
  let digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("90") && digits.length === 12) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
  if (!/^[2-5]\d{9}$/.test(digits)) return null;
  return `+90${digits}`;
}

export const orderRequestSchema = z.object({
  finish: z.enum(FINISH_IDS, { error: "Bir kaplama seç." }),
  quantity: z.coerce
    .number({ error: "Adet gir." })
    .int("Adet tam sayı olmalı.")
    .min(1, "En az 1 adet.")
    .max(1000, "1000 adetten fazlası için bize yaz."),
  fullName: z
    .string()
    .trim()
    .min(3, "Ad ve soyadını yaz.")
    .max(120, "Ad soyad çok uzun.")
    .refine((v) => v.includes(" "), "Ad ve soyadını birlikte yaz."),
  phone: z
    .string()
    .trim()
    .transform((v, ctx) => {
      const normalized = normalizeTurkishPhone(v);
      if (!normalized) {
        ctx.addIssue({ code: "custom", message: "Geçerli bir telefon numarası yaz." });
        return z.NEVER;
      }
      return normalized;
    }),
  email: z.email("Geçerli bir e-posta adresi yaz.").trim().max(200),
  note: z.string().trim().max(1500, "Not en fazla 1500 karakter olabilir.").optional().default(""),
  consent: z.literal("on", { error: "Devam etmek için onay vermelisin." }),
});

export type OrderRequest = z.infer<typeof orderRequestSchema>;
