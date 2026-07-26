import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { LandingProduct } from "@/components/site/landing/types";
import { Reveal } from "@/components/site/reveal";
import { WishlistButton } from "@/components/site/wishlist-button";
import { StockLabel } from "@/components/site/stock-label";
import { newsreader } from "./fonts";
import { hd, COLLECTION_FALLBACKS } from "./imagery";
import { Eyebrow, DisplayHeading, ArrowLink, TranslatedText } from "./chrome";

/**
 * "In the workshop now" — the featured pieces as warm editorial cards:
 * material label, serif name, price with any compare-at struck through, a
 * wishlist heart and a stock tag. Server Component (renders Decimal prices);
 * the heart and stock label are the only client leaves.
 */
export function WorkshopCollection({ products }: { products: LandingProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-[#efe7da] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-4">
            <Eyebrow k="workshop.collectionKicker" />
            <DisplayHeading
              k="workshop.collectionTitle"
              className="text-[34px] leading-[1] tracking-[-0.02em] text-[#17140f] sm:text-[44px]"
            />
          </div>
          <ArrowLink href="/products" k="president.viewAll" className="mb-2" />
        </div>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {products.map((product, i) => {
            const image = product.images[0];
            const src = hd(image?.url, 900) ?? COLLECTION_FALLBACKS[i % COLLECTION_FALLBACKS.length];
            return (
              <Reveal key={product.id} delay={(i % 4) * 80}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group flex h-full flex-col gap-3 border border-[#e2d9cb] bg-[#fffdf9] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#17140f]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e1d2]">
                    <Image
                      src={src}
                      alt={image?.alt ?? product.name}
                      fill
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    {product.stockStatus !== "IN_STOCK" && (
                      <span className="absolute left-2.5 top-2.5 bg-[#17140f] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#f6f1e9]">
                        <StockLabel status={product.stockStatus} />
                      </span>
                    )}
                    <WishlistButton
                      productId={product.id}
                      className="absolute right-2 top-2 h-8 w-8 border-[#e2d9cb] bg-[#fffdf9]/90"
                    />
                  </div>

                  <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#8a8073]">
                    <TranslatedText k={`materials.${product.material}`} />
                  </span>
                  <span className={`${newsreader.className} text-[19px] leading-[1.25] text-[#17140f]`}>
                    {product.name}
                  </span>
                  <div className="mt-auto flex items-baseline gap-2.5 pt-1.5">
                    <span className="text-[15px] font-semibold text-[#17140f]">
                      {formatPrice(product.price.toString())}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-[12px] text-[#a39887] line-through">
                        {formatPrice(product.compareAtPrice.toString())}
                      </span>
                    )}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
