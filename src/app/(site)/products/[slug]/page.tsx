import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WishlistButton } from "@/components/site/wishlist-button";
import { ProductImageGallery } from "@/components/site/product-image-gallery";
import { AddToCartButton } from "@/components/site/add-to-cart-button";
import { LeadForm } from "@/components/site/lead-form";
import { ProductInterestHeading, ProductInterestSubtitle, RelatedProductsHeading } from "@/components/site/product-interest-block";
import { ProductCard } from "@/components/site/product-card";
import { ViewTracker } from "@/components/site/view-tracker";
import { StockIndicator } from "@/components/site/stock-indicator";
import { ProductSpecTable } from "@/components/site/product-spec-table";
import { DeliveryEstimate } from "@/components/site/delivery-estimate";
import { PaymentMethodsStrip } from "@/components/site/payment-methods-strip";
import { formatPrice, discountPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      material: true,
    },
  });

  if (!product) notFound();

  // Cart/wishlist only ever show a static <img>, so they need an actual
  // photo, not whichever gallery item happens to be first.
  const image = product.images.find((img) => img.type === "IMAGE");

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    include: { images: { where: { type: "IMAGE" }, orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const percentOff = discountPercent(product.price.toString(), product.compareAtPrice?.toString());

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ViewTracker productId={product.id} />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="relative">
          <ProductImageGallery images={product.images} productName={product.name} />
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
            {percentOff !== null && (
              <span className="text-sm font-semibold text-emerald-600">{percentOff}% off</span>
            )}
          </div>

          <div className="mt-3">
            <StockIndicator status={product.stockStatus} />
          </div>

          <p className="mt-6 leading-relaxed text-neutral-700">{product.description}</p>

          {product.deliveryEstimate && (
            <div className="mt-4">
              <DeliveryEstimate estimate={product.deliveryEstimate} />
            </div>
          )}

          <div className="mt-6">
            <AddToCartButton
              productId={product.id}
              stockStatus={product.stockStatus}
              name={product.name}
              price={Number(product.price)}
              imageUrl={image?.url}
            />
          </div>

          <div className="mt-5">
            <PaymentMethodsStrip />
          </div>

          <div className="mt-8">
            <ProductSpecTable
              material={product.material}
              room={product.room}
              color={product.color}
              dimensions={product.dimensions}
            />
          </div>

          <div className="mt-8 rounded-xl border border-neutral-200 p-6">
            <ProductInterestHeading />
            <ProductInterestSubtitle />
            <div className="mt-4">
              <LeadForm productIds={[product.id]} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <RelatedProductsHeading />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
