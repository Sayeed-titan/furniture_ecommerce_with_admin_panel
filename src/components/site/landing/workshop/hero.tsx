import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { LandingProduct } from "@/components/site/landing/types";
import { newsreader } from "./fonts";
import { WorkshopHeroCopy } from "./hero-copy";

/**
 * Editorial hero: warm ink ground with a hairline-ruled texture, the masked
 * serif headline on the left and the featured piece presented as a framed
 * "plate" on the right (its photo, a caption tag and price). Server
 * Component — it renders the product's Decimal price directly; the animated,
 * translated copy is delegated to WorkshopHeroCopy (a Client Component).
 */
export function WorkshopHero({ heroProduct }: { heroProduct?: LandingProduct }) {
  const image = heroProduct?.images[0];

  return (
    <section className="relative overflow-hidden bg-[#17140f] text-[#f6f1e9]">
      {/* warm glow + vertical hairline texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(120% 90% at 15% 5%, rgba(63,49,33,0.85) 0%, rgba(23,20,15,0) 55%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(246,241,233,0.5) 0 1px, transparent 1px 120px)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24 lg:px-8">
        <WorkshopHeroCopy />

        {/* Featured piece — framed plate */}
        {heroProduct && (
          <Link
            href={`/products/${heroProduct.slug}`}
            className="wsp-anim group relative block opacity-0 [animation:wsp-rise_0.9s_0.5s_ease-out_forwards]"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#f6f1e9]/15 bg-[#241f18]">
              {image ? (
                <Image
                  src={image.url}
                  alt={image.alt ?? heroProduct.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-xs text-[#f6f1e9]/40">
                  {heroProduct.name}
                </div>
              )}
              <span className="absolute left-4 top-4 bg-[#f6f1e9] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#17140f]">
                Featured piece
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <span className={`${newsreader.className} text-xl leading-tight`}>
                {heroProduct.name}
              </span>
              <span className="shrink-0 font-mono text-sm tabular-nums text-[#e2c08a]">
                {formatPrice(heroProduct.price.toString())}
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#f6f1e9]/45 lg:flex">
        <span>Scroll</span>
        <span
          aria-hidden="true"
          className="wsp-anim block h-9 w-px bg-gradient-to-b from-[#f6f1e9]/60 to-transparent [animation:wsp-cue_2.4s_ease-in-out_infinite]"
        />
      </div>
    </section>
  );
}
