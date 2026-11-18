import { getTranslations } from "next-intl/server";

import type { Locale } from "@/lib/i18n/config";
import { ArrowUpRight } from "lucide-react";

import { getAvatarUrl } from "@/lib/dal/public-card";
import type { PublicCardProduct } from "@/lib/validations/card";

/** Products and services the owner lists on the card, with photo, price and link. */
export async function PublicProductsSection({
  products,
  locale = "tr",
}: {
  products: PublicCardProduct[];
  locale?: Locale;
}) {
  if (products.length === 0) return null;

  const [t, images] = await Promise.all([
    getTranslations({ locale, namespace: "card.products" }),
    Promise.all(products.map((p) => getAvatarUrl(p.imagePath))),
  ]);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-medium tracking-tight">{t("title")}</h2>
      <ul className="grid grid-cols-2 gap-3">
        {products.map((product, i) => {
          const image = images[i];
          const body = (
            <>
              <div className="aspect-square w-full overflow-hidden rounded-md bg-muted">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- remote storage URL
                  <img
                    src={image}
                    alt={product.title}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex flex-col gap-0.5 px-1 pb-1">
                <span className="line-clamp-2 text-sm font-medium">{product.title}</span>
                {product.price ? (
                  <span className="text-sm text-primary">{product.price}</span>
                ) : null}
                {product.description ? (
                  <span className="line-clamp-3 text-xs text-muted-foreground">
                    {product.description}
                  </span>
                ) : null}
                {product.url ? (
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium">
                    {t("open")}
                    <ArrowUpRight aria-hidden="true" className="size-3" />
                  </span>
                ) : null}
              </div>
            </>
          );
          return (
            <li key={product.id}>
              {product.url ? (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex h-full flex-col gap-2 rounded-lg border border-border/60 p-2 transition-colors hover:border-border"
                >
                  {body}
                </a>
              ) : (
                <div className="flex h-full flex-col gap-2 rounded-lg border border-border/60 p-2">
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
