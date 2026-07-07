import { ChevronDown } from "lucide-react";
import type { LandingPageData } from "@/components/site/landing/types";
import { PremiumHero } from "@/components/site/landing/premium/hero";
import { TrustStrip } from "@/components/site/landing/premium/trust-strip";
import { CategoryShowcase } from "@/components/site/landing/premium/category-showcase";
import { CraftSection } from "@/components/site/landing/premium/craft-section";
import { PremiumCta } from "@/components/site/landing/premium/cta";
import { Reveal } from "@/components/site/reveal";
import { Statement } from "./statement";
import { Services } from "./services";
import { MaterialShowcase } from "./material-showcase";
import { TrendingCarousel } from "./trending-carousel";
import { Faq } from "./faq";
import { NewsletterStrip } from "./newsletter";
import { Chapter } from "./chapter";
import { SectionNav } from "./section-nav";

/**
 * Type 4 — Immersive: same full-bleed photo hero as Type 3 (kept
 * intentionally unchanged), but organized into full-screen "chapters" that
 * scroll-snap into place (see snap-y on <html> in the root layout, and
 * Chapter below). A fixed side nav shows every chapter up front and jumps
 * straight to any of them, so the page reads as one deliberate scroll
 * instead of an endless one.
 */
export function ImmersiveLanding({ featuredProducts, categories }: LandingPageData) {
  return (
    <div className="bg-white">
      <SectionNav />

      <Chapter id="hero" className="relative">
        <PremiumHero heroProduct={featuredProducts[0]} />
        <a
          href="#why-us"
          aria-label="Scroll to the next section"
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full p-2 text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-safe:animate-bounce"
        >
          <ChevronDown className="h-7 w-7" aria-hidden="true" />
        </a>
      </Chapter>

      <Chapter id="why-us" className="flex min-h-screen flex-col justify-center">
        <TrustStrip />
        <Statement />
        <Services />
      </Chapter>

      <Chapter id="explore" className="min-h-screen">
        <Reveal>
          <CategoryShowcase categories={categories} />
        </Reveal>
        <MaterialShowcase products={featuredProducts} />
      </Chapter>

      <Chapter id="trending" className="flex min-h-screen flex-col justify-center">
        <TrendingCarousel products={featuredProducts} />
      </Chapter>

      <Chapter id="craft" className="min-h-screen">
        <Reveal>
          <CraftSection product={featuredProducts[1] ?? featuredProducts[0]} />
        </Reveal>
        <Faq />
      </Chapter>

      <Chapter id="connect" className="flex min-h-screen flex-col justify-center">
        <NewsletterStrip />
        <Reveal>
          <PremiumCta />
        </Reveal>
      </Chapter>
    </div>
  );
}
