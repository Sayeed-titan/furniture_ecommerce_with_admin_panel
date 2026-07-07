import Link from "next/link";
import { ProductCard } from "@/components/site/product-card";
import type { LandingProduct } from "@/components/site/landing/types";

export function PremiumFeaturedGrid({ products }: { products: LandingProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              Customer Favorites
            </h2>
            <p className="mt-1 text-neutral-600">Popular pieces, ready to view and save.</p>
          </div>
          <Link
            href="/products"
            className="hidden text-sm font-medium text-neutral-600 hover:text-neutral-900 sm:block"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
