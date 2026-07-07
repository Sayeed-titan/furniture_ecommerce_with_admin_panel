import { Hero } from "@/components/site/sections/hero";
import { ValueProps } from "@/components/site/sections/value-props";
import { CategoryGrid } from "@/components/site/sections/category-grid";
import { FeaturedProducts } from "@/components/site/sections/featured-products";
import { CtaBanner } from "@/components/site/sections/cta-banner";
import type { LandingPageData } from "@/components/site/landing/types";

/**
 * Type 1 — Generic
 * Clean, conservative layout. Safe default for any furniture business.
 */
export function GenericLanding({ featuredProducts, categories }: LandingPageData) {
  return (
    <div>
      <Hero />
      <ValueProps />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <CtaBanner />
    </div>
  );
}
