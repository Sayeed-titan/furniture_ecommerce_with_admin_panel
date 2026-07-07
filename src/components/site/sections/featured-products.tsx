import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/site/product-card";

export async function FeaturedProducts() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  if (featuredProducts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Featured Pieces</h2>
        <Link href="/products" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          View all &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
