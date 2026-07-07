import Image from "next/image";
import Link from "next/link";
import type { Product, ProductImage } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { formatStockStatus } from "@/lib/format";
import { WishlistButton } from "@/components/site/wishlist-button";

type ProductWithImages = Product & { images: ProductImage[] };

const stockVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  IN_STOCK: "success",
  LOW_STOCK: "warning",
  OUT_OF_STOCK: "destructive",
  MADE_TO_ORDER: "secondary",
};

export function ProductCard({ product }: { product: ProductWithImages }) {
  const image = product.images[0];

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              No image
            </div>
          )}
          <Badge
            variant={stockVariant[product.stockStatus] ?? "secondary"}
            className="absolute right-3 top-3"
          >
            {formatStockStatus(product.stockStatus)}
          </Badge>
          <WishlistButton productId={product.id} className="absolute left-3 top-3" />
        </div>
        <CardContent className="space-y-1 py-4">
          <h3 className="font-medium text-neutral-900">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-neutral-900">
              {formatPrice(product.price.toString())}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice.toString())}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
