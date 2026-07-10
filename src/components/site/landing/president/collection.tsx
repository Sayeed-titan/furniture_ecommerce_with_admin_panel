import Image from "next/image";
import Link from "next/link";
import type { LandingProduct } from "@/components/site/landing/types";
import { Reveal } from "@/components/site/reveal";
import { formatPrice } from "@/lib/utils";
import { Eyebrow, DisplayHeading, ArrowLink } from "./chrome";

/**
 * The Collection — an asymmetric editorial grid: the lead piece runs large,
 * the rest stagger down the right rail with brass index numbers. Server
 * Component so Prisma Decimals never cross into client props.
 */
export function Collection({ products }: { products: LandingProduct[] }) {
  const [lead, ...rest] = products;
  if (!lead) return null;

  return (
    <section className="bg-[#14100c] px-4 py-24 text-[#f4efe6] sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow k="president.collectionKicker" className="mb-6" />
            <DisplayHeading
              k="president.collectionTitle"
              className="text-4xl font-medium leading-tight sm:text-6xl"
            />
          </div>
          <ArrowLink href="/products" k="president.viewAll" className="mb-2" />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-12">
          {/* Lead piece */}
          <Reveal className="lg:col-span-7">
            <CollectionCard product={lead} index={0} large />
          </Reveal>

          {/* Staggered rail */}
          <div className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-x-10 lg:col-span-5 lg:grid-cols-1 lg:pt-24">
            {rest.slice(0, 2).map((p, i) => (
              <Reveal key={p.id} delay={120 * (i + 1)}>
                <CollectionCard product={p} index={i + 1} />
              </Reveal>
            ))}
          </div>
        </div>

        {rest.length > 2 && (
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(2, 5).map((p, i) => (
              <Reveal key={p.id} delay={100 * i}>
                <CollectionCard product={p} index={i + 3} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CollectionCard({
  product,
  index,
  large = false,
}: {
  product: LandingProduct;
  index: number;
  large?: boolean;
}) {
  const image = product.images[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div
        className={`relative overflow-hidden bg-[#241c15] ${large ? "aspect-[4/3]" : "aspect-[4/5]"}`}
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            sizes={large ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#f4efe6]/30">
            {product.name}
          </div>
        )}
        {/* Brass frame that draws itself on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 border border-[#d9b779]/0 transition-all duration-500 group-hover:inset-4 group-hover:border-[#d9b779]/70"
        />
        <span className="absolute left-4 top-4 font-mono text-xs tracking-[0.3em] text-[#d9b779]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3
          className={`font-medium tracking-tight text-[#f4efe6] transition-colors group-hover:text-[#d9b779] ${large ? "text-2xl" : "text-lg"} [font-family:var(--font-display),serif]`}
        >
          {product.name}
        </h3>
        <p className="shrink-0 text-sm font-medium text-[#f4efe6]/60">
          {formatPrice(product.price.toString())}
        </p>
      </div>
    </Link>
  );
}
