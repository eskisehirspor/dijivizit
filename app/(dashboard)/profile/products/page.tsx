import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ProductsManager } from "@/components/profile/products-manager";
import { listOwnProducts, MAX_PRODUCTS } from "@/lib/dal/profile-products";
import { getAvatarUrl } from "@/lib/dal/public-card";
import { routes } from "@/lib/routes";

export async function generateMetadata() {
  const t = await getTranslations("profile.products");
  return { title: t("title") };
}

export default async function ProfileProductsPage() {
  const [t, products] = await Promise.all([getTranslations("profile.products"), listOwnProducts()]);
  const items = await Promise.all(
    products.map(async (p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      url: p.url,
      imageUrl: await getAvatarUrl(p.imagePath),
      isVisible: p.isVisible,
    })),
  );

  return (
    <div className="flex animate-rise flex-col gap-12">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t("title")}</h1>
        <p className="text-sm text-pretty text-muted-foreground">{t("subtitle")}</p>
        <p className="pt-3">
          <Link
            href={routes.profileEdit}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            {t("backToEdit")}
          </Link>
        </p>
      </div>
      <ProductsManager products={items} max={MAX_PRODUCTS} />
    </div>
  );
}
