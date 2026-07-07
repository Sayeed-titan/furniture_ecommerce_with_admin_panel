import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/product-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <section className="bg-neutral-50">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24 sm:px-6 lg:px-8">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            Furniture built to last, made for how you live.
          </h1>
          <p className="max-w-xl text-lg text-neutral-600">
            Solid wood, artificial wood, and leather furniture for the home and
            office. Browse our catalog, save your favorites, and let us bring
            them to life for you.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Talk to Us</Link>
            </Button>
          </div>
        </div>
      </section>

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
          {featuredProducts.length === 0 && (
            <p className="col-span-full text-sm text-neutral-500">
              No featured products yet. Add some from the admin panel.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
