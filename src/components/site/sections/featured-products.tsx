import Link from "next/link";
import { ProductCard } from "@/components/site/product-card";
import type { LandingProduct } from "@/components/site/landing/types";

export function FeaturedProducts({ products }: { products: LandingProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Featured Pieces</h2>
        <Link href="/products" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          View all &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
