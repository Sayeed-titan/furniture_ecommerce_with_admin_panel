import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/site/wishlist-button";
import { LeadForm } from "@/components/site/lead-form";
import { EnumLabel } from "@/components/site/enum-label";
import { ProductInterestHeading, ProductInterestSubtitle } from "@/components/site/product-interest-block";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const stockVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  IN_STOCK: "success",
  LOW_STOCK: "warning",
  OUT_OF_STOCK: "destructive",
  MADE_TO_ORDER: "secondary",
};

type Params = Promise<{ slug: string }>;

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
    },
  });

  if (!product) notFound();

  const image = product.images[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-400">
              No image
            </div>
          )}
          <WishlistButton productId={product.id} className="absolute left-4 top-4 h-11 w-11" />
        </div>

        <div>
          <p className="text-sm font-medium text-neutral-500">{product.category.name}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold">{formatPrice(product.price.toString())}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice.toString())}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant={stockVariant[product.stockStatus] ?? "secondary"}>
              <EnumLabel group="stock" value={product.stockStatus} />
            </Badge>
            <Badge variant="outline">
              <EnumLabel group="materials" value={product.material} />
            </Badge>
            <Badge variant="outline">
              <EnumLabel group="rooms" value={product.room} />
            </Badge>
          </div>

          <p className="mt-6 leading-relaxed text-neutral-700">{product.description}</p>

          <div className="mt-10 rounded-xl border border-neutral-200 p-6">
            <ProductInterestHeading />
            <ProductInterestSubtitle />
            <div className="mt-4">
              <LeadForm productIds={[product.id]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
