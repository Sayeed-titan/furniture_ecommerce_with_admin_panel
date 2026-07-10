import { GenericLanding } from "@/components/site/landing/generic";
import { CreativeFable5Landing } from "@/components/site/landing/creative_fable5";
import { PremiumLanding } from "@/components/site/landing/premium";
import { ImmersiveLanding } from "@/components/site/landing/immersive";
import { PresidentLanding } from "@/components/site/landing/president";
import type { LandingVariantComponent, LandingVariantKey } from "@/components/site/landing/types";

/**
 * Every landing page variant, keyed by LandingVariantKey.
 *
 * To add a new variant:
 * 1. Build it under src/components/site/landing/<key>/index.tsx, accepting
 *    LandingPageData as props (see types.ts).
 * 2. Add "<key>" to the LandingVariantKey union in types.ts.
 * 3. Register it here.
 * 4. Point ACTIVE_LANDING_VARIANT (src/config/landing.ts) at it — later this
 *    will be a setting the admin panel writes instead of a hardcoded value.
 */
export const landingVariants: Record<LandingVariantKey, LandingVariantComponent> = {
  generic: GenericLanding,
  creative_fable5: CreativeFable5Landing,
  premium: PremiumLanding,
  immersive: ImmersiveLanding,
  president: PresidentLanding,
};

export const landingVariantLabels: Record<LandingVariantKey, string> = {
  generic: "Type 1 — Generic",
  creative_fable5: "Type 2 — Creative (Fable 5): The Workshop Folio",
  premium: "Type 3 — Premium: clean & product-led",
  immersive: "Type 4 — Immersive: same hero, richer & more playful page",
  president: "Type 5 — President: flagship brand experience (WebGL + motion)",
};
