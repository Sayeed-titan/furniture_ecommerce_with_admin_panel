"use client";

import { useEffect, useState } from "react";
import type { Product, ProductImage } from "@prisma/client";
import { useWishlist } from "@/components/site/wishlist-context";
import { ProductCard } from "@/components/site/product-card";
import { LeadForm } from "@/components/site/lead-form";
import { WishlistEmptyState } from "@/components/site/products-page-chrome";
import { useTranslation } from "@/lib/i18n/use-translation";

type ProductWithImages = Product & { images: ProductImage[] };

export default function WishlistPage() {
  const { ids } = useWishlist();
  const { t } = useTranslation();
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(ids.length > 0);

  useEffect(() => {
    if (ids.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicking off a fetch is the standard use case for this effect
    setLoading(true);
    fetch(`/api/products?ids=${ids.join(",")}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, [ids]);

  // Re-filter locally so removing an item updates the view instantly,
  // without waiting on a new fetch.
  const visibleProducts = products.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">{t("wishlistPage.heading")}</h1>
      <p className="mt-2 text-neutral-600">{t("wishlistPage.subtitle")}</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {!loading && visibleProducts.length === 0 && <WishlistEmptyState />}
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {visibleProducts.length > 0 && (
          <aside className="h-fit rounded-xl border border-neutral-200 p-6">
            <h2 className="font-semibold text-neutral-900">{t("wishlistPage.sendListHeading")}</h2>
            <p className="mt-1 text-sm text-neutral-600">
              {t("wishlistPage.sendListPrefix")} {visibleProducts.length}{" "}
              {visibleProducts.length === 1 ? t("wishlistPage.itemSingular") : t("wishlistPage.itemPlural")}.
            </p>
            <div className="mt-4">
              <LeadForm productIds={visibleProducts.map((p) => p.id)} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
