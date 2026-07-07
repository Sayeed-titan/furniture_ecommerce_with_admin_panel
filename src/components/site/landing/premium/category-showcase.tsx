import Image from "next/image";
import Link from "next/link";
import type { LandingCategory } from "@/components/site/landing/types";
import { CategoryShowcaseHeading, ViewAllLink, ItemCountLabel } from "./category-showcase-copy";

/**
 * Stays a Server Component — `categories` carries nested product objects
 * with a Decimal price field, which can't cross into a Client Component as
 * a prop. Translatable copy lives in category-showcase-copy.tsx.
 */
export function CategoryShowcase({ categories }: { categories: LandingCategory[] }) {
  const visible = categories.filter((c) => c._count.products > 0).slice(0, 4);
  if (visible.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <CategoryShowcaseHeading />
        <ViewAllLink />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((category) => {
          const image = category.products[0]?.images[0];
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-2xl bg-neutral-100"
            >
              {image && (
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
              <div className="relative mt-auto flex w-full items-center justify-between p-5">
                <div>
                  <p className="text-lg font-medium text-white">{category.name}</p>
                  <p className="text-sm text-white/75">
                    <ItemCountLabel count={category._count.products} />
                  </p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-900 transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
