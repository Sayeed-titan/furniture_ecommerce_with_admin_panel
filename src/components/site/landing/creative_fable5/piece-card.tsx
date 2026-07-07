import Image from "next/image";
import Link from "next/link";
import type { LandingProduct } from "@/components/site/landing/types";
import { WishlistButton } from "@/components/site/wishlist-button";
import { cn, formatPrice } from "@/lib/utils";
import { formatMaterial, formatRoom, formatStockStatus } from "@/lib/format";

/**
 * Editorial "plate" treatment for a product — a numbered folio entry rather
 * than a boxed card: image plate, hairline rule, specimen-style caption.
 */
export function PieceCard({
  product,
  index,
  aspect = "aspect-[4/5]",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  large = false,
  className,
}: {
  product: LandingProduct;
  index: number;
  aspect?: string;
  sizes?: string;
  large?: boolean;
  className?: string;
}) {
  const image = product.images[0];
  const folio = String(index + 1).padStart(2, "0");
  const outOfStock = product.stockStatus === "OUT_OF_STOCK";

  return (
    <article className={cn("group relative", className)}>
      <Link
        href={`/products/${product.slug}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9c3d16]"
      >
        <div className={cn("relative overflow-hidden bg-[#e7ddc9]", aspect)}>
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              sizes={sizes}
              className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div
              aria-hidden="true"
              className="h-full w-full bg-[repeating-linear-gradient(105deg,#e7ddc9_0px,#e7ddc9_14px,#ddd0b6_14px,#ddd0b6_16px)]"
            />
          )}
          {/* folio number stamped over the plate */}
          <span
            aria-hidden="true"
            className="absolute left-3 top-2 font-serif text-sm italic text-[#f5efe4] mix-blend-difference"
          >
            No. {folio}
          </span>
          {outOfStock && (
            <span className="absolute bottom-3 left-3 bg-[#1c1610] px-2 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-[#f5efe4]">
              {formatStockStatus(product.stockStatus)}
            </span>
          )}
        </div>

        <div className="mt-4 border-t border-[#1c1610] pt-3">
          <div className="flex items-baseline justify-between gap-4">
            <h3
              className={cn(
                "font-serif tracking-tight text-[#1c1610] underline-offset-4 group-hover:underline",
                large ? "text-2xl sm:text-3xl" : "text-xl"
              )}
            >
              {product.name}
            </h3>
            <p className="shrink-0 font-mono text-sm text-[#1c1610]">
              {formatPrice(product.price.toString())}
            </p>
          </div>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#6b5a48]">
            {formatMaterial(product.material)} &middot; {formatRoom(product.room)}
            {product.stockStatus !== "IN_STOCK" && !outOfStock && (
              <> &middot; {formatStockStatus(product.stockStatus)}</>
            )}
          </p>
        </div>
      </Link>
      <WishlistButton
        productId={product.id}
        className="absolute right-3 top-3 border-transparent bg-[#f5efe4]/95 hover:border-[#9c3d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9c3d16]"
      />
    </article>
  );
}
