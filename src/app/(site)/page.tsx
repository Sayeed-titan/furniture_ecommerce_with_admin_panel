import { Hero } from "@/components/site/sections/hero";
import { ValueProps } from "@/components/site/sections/value-props";
import { CategoryGrid } from "@/components/site/sections/category-grid";
import { FeaturedProducts } from "@/components/site/sections/featured-products";
import { CtaBanner } from "@/components/site/sections/cta-banner";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <ValueProps />
      <CategoryGrid />
      <FeaturedProducts />
      <CtaBanner />
    </div>
  );
}
