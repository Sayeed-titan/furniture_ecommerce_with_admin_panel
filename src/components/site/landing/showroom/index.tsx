import { ShowroomHero } from "./hero";
import { ShowroomPillars } from "./pillars";
import { CategoryGrid } from "@/components/site/sections/category-grid";
import { FeaturedProducts } from "@/components/site/sections/featured-products";
import { CtaBanner } from "@/components/site/sections/cta-banner";
import type { LandingPageData } from "@/components/site/landing/types";

/**
 * Type 7 — Showroom: a Three.js hero (abstract floating furniture-form
 * fragments, brand gold/ink palette, no external HDRI dependency) followed
 * by the same shared catalogue sections other variants use, so the new
 * piece is the hero craft, not a full rebuild of the page below it.
 */
export function ShowroomLanding({ featuredProducts, categories }: LandingPageData) {
  return (
    <div>
      <ShowroomHero />
      <ShowroomPillars />
      <FeaturedProducts products={featuredProducts} />
      <CategoryGrid categories={categories} />
      <CtaBanner />
    </div>
  );
}
