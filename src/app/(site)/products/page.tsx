import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/site/product-card";
import { ProductFilters } from "@/components/site/product-filters";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = { title: "Products" };

type SearchParams = Promise<{
  category?: string;
  material?: string;
  room?: string;
  stock?: string;
  sort?: string;
}>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const where: Prisma.ProductWhereInput = {};
  if (params.category) where.category = { slug: params.category };
  if (params.material) where.material = params.material as Prisma.EnumMaterialTypeFilter["equals"];
  if (params.room) where.room = params.room as Prisma.EnumRoomTypeFilter["equals"];
  if (params.stock) where.stockStatus = params.stock as Prisma.EnumStockStatusFilter["equals"];

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    params.sort === "price_asc"
      ? { price: "asc" }
      : params.sort === "price_desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
      <p className="mt-2 text-neutral-600">
        {products.length} {products.length === 1 ? "item" : "items"} found
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <ProductFilters categories={categories} activeParams={params} />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            <p className="col-span-full text-sm text-neutral-500">
              No products match these filters yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
