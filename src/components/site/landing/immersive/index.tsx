import type { LandingPageData } from "@/components/site/landing/types";
import { PremiumHero } from "@/components/site/landing/premium/hero";
import { TrustStrip } from "@/components/site/landing/premium/trust-strip";
import { CategoryShowcase } from "@/components/site/landing/premium/category-showcase";
import { CraftSection } from "@/components/site/landing/premium/craft-section";
import { PremiumCta } from "@/components/site/landing/premium/cta";
import { Reveal } from "@/components/site/reveal";
import { MaterialsMarquee } from "./marquee";
import { Statement } from "./statement";
import { MaterialShowcase } from "./material-showcase";
import { TrendingCarousel } from "./trending-carousel";
import { Faq } from "./faq";
import { NewsletterStrip } from "./newsletter";

/**
 * Type 4 — Immersive: same full-bleed photo hero as Type 3 (kept
 * intentionally unchanged), but a longer, more playful page underneath —
 * more sections to browse, a materials ticker, scroll-reveal motion, a
 * display font for statement headings, a draggable product carousel, and
 * an FAQ + newsletter strip for extra engagement paths beyond the wishlist.
 */
export function ImmersiveLanding({ featuredProducts, categories }: LandingPageData) {
  return (
    <div className="bg-white">
      <PremiumHero heroProduct={featuredProducts[0]} />
      <MaterialsMarquee />
      <TrustStrip />
      <Statement />
      <MaterialShowcase products={featuredProducts} />
      <Reveal>
        <CategoryShowcase categories={categories} />
      </Reveal>
      <TrendingCarousel products={featuredProducts} />
      <Reveal>
        <CraftSection product={featuredProducts[1] ?? featuredProducts[0]} />
      </Reveal>
      <Faq />
      <NewsletterStrip />
      <Reveal>
        <PremiumCta />
      </Reveal>
    </div>
  );
}
