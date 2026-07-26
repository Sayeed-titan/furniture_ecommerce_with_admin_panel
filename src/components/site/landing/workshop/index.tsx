import type { LandingPageData } from "@/components/site/landing/types";
import { WorkshopHero } from "./hero";
import { WorkshopMarquee } from "./marquee";
import { WorkshopPaths } from "./paths";
import { WorkshopRooms } from "./rooms";
import { WorkshopCollection } from "./collection";
import { WorkshopStory } from "./workshop-story";
import { WorkshopServicesRow } from "./services-row";
import { WorkshopEnquiryCta } from "./enquiry-cta";

/**
 * Type 6 — Workshop: a warm, paper-toned editorial catalogue derived from the
 * "President Furniture" design system. Newsreader serif + mono index labels
 * on a sand/cream ground, with two dark ink breaks (hero + workshop story).
 *
 * The narrative runs: hero → sector marquee → the two ways to buy →
 * rooms → featured collection → the manufacturing story → service promises →
 * enquiry. Data sections stay Server Components (Prisma Decimals never cross
 * the client boundary); only translated leaves, the wishlist heart and the
 * lead form run on the client. All motion honours prefers-reduced-motion.
 */
export function WorkshopLanding({ featuredProducts, categories }: LandingPageData) {
  return (
    <div className="bg-[#efe7da]">
      <WorkshopHero heroProduct={featuredProducts[0]} />
      <WorkshopMarquee />
      <WorkshopPaths />
      <WorkshopRooms categories={categories} />
      <WorkshopCollection products={featuredProducts} />
      <WorkshopStory products={featuredProducts} />
      <WorkshopServicesRow />
      <WorkshopEnquiryCta />
    </div>
  );
}
