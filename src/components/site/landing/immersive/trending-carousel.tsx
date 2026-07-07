import { ProductCard } from "@/components/site/product-card";
import { Reveal } from "@/components/site/reveal";
import type { LandingProduct } from "@/components/site/landing/types";
import { CarouselScroller } from "./carousel-scroller";
import { TrendingHeading } from "./trending-heading";

export function TrendingCarousel({ products }: { products: LandingProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <TrendingHeading />
        </Reveal>

        <CarouselScroller>
          {products.map((product) => (
            <div key={product.id} className="w-64 shrink-0 snap-start sm:w-72">
              <ProductCard product={product} />
            </div>
          ))}
        </CarouselScroller>
      </div>
    </section>
  );
}
