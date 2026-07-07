import type { LandingPageData } from "@/components/site/landing/types";
import { PremiumHero } from "./hero";
import { TrustStrip } from "./trust-strip";
import { CategoryShowcase } from "./category-showcase";
import { PremiumFeaturedGrid } from "./featured-grid";
import { CraftSection } from "./craft-section";
import { PremiumCta } from "./cta";

/**
 * Type 3 — Premium: clean, product-photography-led, low-friction.
 * The product is the hero (literally); everything else stays out of the way
 * so the visitor can look, feel drawn in, and save/contact without friction.
 */
export function PremiumLanding({ featuredProducts, categories }: LandingPageData) {
  return (
    <div className="bg-white">
      <PremiumHero heroProduct={featuredProducts[0]} />
      <TrustStrip />
      <CategoryShowcase categories={categories} />
      <PremiumFeaturedGrid products={featuredProducts} />
      <CraftSection product={featuredProducts[1] ?? featuredProducts[0]} />
      <PremiumCta />
    </div>
  );
}
