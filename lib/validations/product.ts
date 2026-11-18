import { z } from "zod";

const optionalText = (max: number, key: string) =>
  z
    .string()
    .trim()
    .max(max, key)
    .transform((v) => (v === "" ? null : v));

/** A product or service on the public card. Messages are i18n keys. */
export const productSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "validation.product.titleRequired")
    .max(80, "validation.product.titleTooLong"),
  description: optionalText(300, "validation.product.descriptionTooLong"),
  price: optionalText(40, "validation.product.priceTooLong"),
  url: z
    .string()
    .trim()
    .max(500, "validation.product.urlInvalid")
    .transform((v) => (v === "" ? null : /^https?:\/\//i.test(v) ? v : `https://${v}`))
    .refine((v) => v === null || URL.canParse(v), "validation.product.urlInvalid"),
  imagePath: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v)),
});

export type ProductInput = z.output<typeof productSchema>;
