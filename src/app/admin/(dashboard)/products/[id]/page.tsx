import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { ProductGallery } from "@/components/admin/product-gallery";
import { PageHeader, Section } from "@/components/admin/ui";
import { updateProduct } from "@/lib/actions/products";

export const metadata = { title: "Edit Product" };

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { position: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" /> Products
        </Link>
        <PageHeader title={product.name} description="Edit details, manage the image gallery, and save." />
      </div>
      <Section className="max-w-3xl p-5">
        <h2 className="mb-1 text-sm font-semibold text-neutral-900">Images</h2>
        <p className="mb-4 text-xs text-neutral-500">Changes here save immediately, separately from the details below.</p>
        <ProductGallery
          productId={product.id}
          images={product.images.map((img) => ({ id: img.id, url: img.url, position: img.position }))}
        />
      </Section>

      <ProductForm
        categories={categories}
        action={updateProductWithId}
        showImageField={false}
        defaultValues={{
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          compareAtPrice: product.compareAtPrice?.toString() ?? null,
          material: product.material,
          room: product.room,
          color: product.color,
          dimensions: product.dimensions,
          deliveryEstimate: product.deliveryEstimate,
          stockStatus: product.stockStatus,
          stockQty: product.stockQty,
          featured: product.featured,
          categoryId: product.categoryId,
        }}
      />
    </div>
  );
}
