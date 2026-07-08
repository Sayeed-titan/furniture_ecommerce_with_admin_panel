import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/ui";
import { createProduct } from "@/lib/actions/products";

export const metadata = { title: "New Product" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" /> Products
        </Link>
        <PageHeader title="New product" description="Add a piece to your catalog. You can add more images after saving." />
      </div>
      <ProductForm categories={categories} action={createProduct} />
    </div>
  );
}
