import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function CategoryGrid() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: true } },
      products: {
        take: 1,
        orderBy: { createdAt: "desc" },
        include: { images: { take: 1, orderBy: { position: "asc" } } },
      },
    },
  });

  const visible = categories.filter((c) => c._count.products > 0);
  if (visible.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold tracking-tight">Shop by Category</h2>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {visible.map((category) => {
          const image = category.products[0]?.images[0];
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                {image && (
                  <Image
                    src={image.url}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                  />
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-neutral-900">{category.name}</p>
                <p className="text-xs text-neutral-500">
                  {category._count.products} item{category._count.products === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
