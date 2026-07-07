import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { HeroCopy, FeaturedLabel } from "./hero-copy";
import type { LandingProduct } from "@/components/site/landing/types";

/**
 * Full-bleed hero: the product photo IS the hero, not a text banner with a
 * small thumbnail. Headline sits over a gradient scrim so the piece stays
 * the visual focus while the message stays readable.
 *
 * Stays a Server Component — it renders `heroProduct` directly (Prisma data
 * with a Decimal price field), which can't be passed as a prop into a
 * Client Component. Translatable copy is extracted into hero-copy.tsx.
 */
export function PremiumHero({ heroProduct }: { heroProduct?: LandingProduct }) {
  const image = heroProduct?.images[0];

  return (
    <section className="relative flex min-h-[560px] w-full items-end overflow-hidden bg-neutral-900 sm:min-h-[640px] lg:min-h-[85vh]">
      {image ? (
        <Image
          src={image.url}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-14 pt-32 sm:px-6 sm:pb-16 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:pb-20">
        <HeroCopy />

        {heroProduct && (
          <Link
            href={`/products/${heroProduct.slug}`}
            className="group flex items-center gap-3 self-start rounded-full bg-white/10 py-2 pl-2 pr-5 text-white backdrop-blur-sm transition-colors hover:bg-white/20 lg:self-end"
          >
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/20">
              {image && (
                <Image src={image.url} alt="" fill sizes="48px" className="object-cover" />
              )}
            </span>
            <span className="text-left">
              <FeaturedLabel />
              <span className="block text-sm font-medium">
                {heroProduct.name} &middot; {formatPrice(heroProduct.price.toString())}
              </span>
            </span>
            <span aria-hidden="true" className="ml-1 transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
