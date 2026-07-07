import Image from "next/image";
import { CraftCopy } from "./craft-copy";
import type { LandingProduct } from "@/components/site/landing/types";

/**
 * Stays a Server Component — renders `product` directly (Prisma data with a
 * Decimal price field), which can't cross into a Client Component as a
 * prop. Translatable copy lives in craft-copy.tsx.
 */
export function CraftSection({ product }: { product?: LandingProduct }) {
  const image = product?.images[0];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 lg:aspect-[5/4]">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product?.name ?? ""}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-neutral-200 to-neutral-100" />
          )}
        </div>

        <CraftCopy />
      </div>
    </section>
  );
}
