import type { LandingPageData } from "@/components/site/landing/types";
import { ProductCard } from "@/components/site/product-card";
import { CommercePromoHero } from "./promo-hero";
import { CommerceSectors } from "./sectors";
import { CommerceSectionHeading } from "./section-heading";
import { CommercePromoTiles } from "./promo-tiles";
import { CommerceCategoryGrid } from "./category-grid";
import { CommerceBulkBand } from "./bulk-band";

/**
 * Type 6 — Commerce: a merchandising storefront for President's office,
 * industrial, and hospital ranges. Structured like a modern furniture-retail
 * homepage (banner → sectors → products → services → categories → quote),
 * adapted to a single-brand B2B supplier: no invented discounts, and the
 * hero/sector tiles double as navigation into the catalogue.
 */
export function CommerceLanding({ featuredProducts, categories }: LandingPageData) {
  // "Across the range" = one product per category, minus anything already
  // shown in Trending, so the two grids don't repeat.
  const featuredIds = new Set(featuredProducts.map((p) => p.id));
  const rangeProducts = categories
    .flatMap((c) => c.products)
    .filter((p) => !featuredIds.has(p.id))
    .slice(0, 8);

  const categoryItems = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    imageUrl: c.products[0]?.images[0]?.url ?? null,
    count: c._count.products,
  }));

  return (
    <div className="bg-white">
      <CommercePromoHero />
      <CommerceSectors />

      {featuredProducts.length > 0 && (
        <section className="bg-neutral-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <CommerceSectionHeading
              titleKey="commerce.trendingTitle"
              subtitleKey="commerce.trendingSubtitle"
              viewAllHref="/products"
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CommercePromoTiles />

      {rangeProducts.length > 0 && (
        <section className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <CommerceSectionHeading
              titleKey="commerce.rangeTitle"
              subtitleKey="commerce.rangeSubtitle"
              viewAllHref="/products"
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {rangeProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CommerceCategoryGrid items={categoryItems} />
      <CommerceBulkBand />
    </div>
  );
}
