import type { LandingVariantKey } from "@/components/site/landing/types";

/**
 * Which landing page variant is live right now.
 *
 * TODO(admin-panel): once the admin panel has a "Landing Page" setting,
 * replace this constant with a DB read (e.g. a SiteSetting row) so it can be
 * switched without a deploy. Until then, change this value and redeploy.
 */
export const ACTIVE_LANDING_VARIANT: LandingVariantKey = "generic";
