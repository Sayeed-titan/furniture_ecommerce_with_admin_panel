import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { updateProduct } from "@/lib/actions/products";

export const metadata = { title: "Edit Product" };

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Edit Product</h1>
      <div className="mt-6">
        <ProductForm
          categories={categories}
          action={updateProductWithId}
          defaultValues={{
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            compareAtPrice: product.compareAtPrice?.toString() ?? null,
            material: product.material,
            room: product.room,
            stockStatus: product.stockStatus,
            stockQty: product.stockQty,
            featured: product.featured,
            categoryId: product.categoryId,
            imageUrl: product.images[0]?.url,
          }}
        />
      </div>
    </div>
  );
}
