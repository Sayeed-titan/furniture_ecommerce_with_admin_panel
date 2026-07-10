import type { LandingPageData } from "@/components/site/landing/types";
import { PresidentHero } from "./hero";
import { PresidentMarquee } from "./marquee";
import { Manifesto } from "./manifesto";
import { Collection } from "./collection";
import { Atelier } from "./atelier";
import { CategoryIndex } from "./categories";
import { PresidentCta } from "./cta";
import { BrassCursor, ScrollProgress } from "./cursor";

/**
 * Type 5 — President: the flagship brand experience.
 *
 * A dark, award-site-style page built around the President identity:
 *   · WebGL "liquid silk" shader hero (hand-written GLSL, no three.js dep)
 *   · kinetic serif wordmark that rises letter by letter
 *   · brass custom cursor + scroll progress hairline
 *   · slow editorial marquee, scroll-lit manifesto
 *   · asymmetric collection grid and a numbered category index
 *   · cream "atelier" break with counting stats, sealed with the throne mark
 *
 * All motion is tagged for prefers-reduced-motion, and every data-bearing
 * section stays a Server Component (Decimals never cross to the client).
 */
export function PresidentLanding({ featuredProducts, categories }: LandingPageData) {
  return (
    <div className="bg-[#14100c]">
      <BrassCursor />
      <ScrollProgress />

      <PresidentHero />
      <PresidentMarquee />
      <Manifesto />
      <Collection products={featuredProducts} />
      <Atelier />
      <CategoryIndex categories={categories} />
      <PresidentCta />
    </div>
  );
}
