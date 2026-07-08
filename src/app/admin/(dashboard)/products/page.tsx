import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PageHeader, Section, StatusPill, EmptyRow, type PillTone } from "@/components/admin/ui";
import { SearchInput } from "@/components/admin/search-input";
import { FilterSelect } from "@/components/admin/filter-select";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { formatPrice } from "@/lib/utils";
import { formatStockStatus } from "@/lib/format";
import { deleteProduct } from "@/lib/actions/products";

export const metadata = { title: "Products" };
export const dynamic = "force-dynamic";

const STOCK_TONE: Record<string, PillTone> = {
  IN_STOCK: "green",
  LOW_STOCK: "amber",
  OUT_OF_STOCK: "red",
  MADE_TO_ORDER: "blue",
};

type SearchParams = Promise<{ q?: string; category?: string; stock?: string }>;

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, category, stock } = await searchParams;

  const where: Prisma.ProductWhereInput = {};
  if (q) where.name = { contains: q, mode: "insensitive" };
  if (category) where.categoryId = category;
  if (stock) where.stockStatus = stock as Prisma.EnumStockStatusFilter["equals"];

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { category: true, images: { orderBy: { position: "asc" }, take: 1 } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader title="Products" description={`${products.length} ${products.length === 1 ? "product" : "products"}`}>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" /> New product
        </Link>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput placeholder="Search products..." />
        <FilterSelect
          param="category"
          placeholder="All categories"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <FilterSelect
          param="stock"
          placeholder="All stock"
          options={Object.keys(STOCK_TONE).map((s) => ({ value: s, label: formatStockStatus(s) }))}
        />
      </div>

      <Section className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((p) => {
                const img = p.images[0];
                return (
                  <tr key={p.id} className="hover:bg-neutral-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-neutral-100">
                          {img ? (
                            // eslint-disable-next-line @next/next/no-img-element -- tiny admin thumbnail
                            <img src={img.url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-neutral-400">No img</span>
                          )}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium text-neutral-900">
                          {p.name}
                          {p.featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{p.category.name}</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(p.price.toString())}</td>
                    <td className="px-4 py-3">
                      <StatusPill tone={STOCK_TONE[p.stockStatus] ?? "neutral"}>
                        {formatStockStatus(p.stockStatus)}
                      </StatusPill>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Link>
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={p.id} />
                          <ConfirmSubmit message={`Delete "${p.name}"? This cannot be undone.`} variant="danger">
                            Delete
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <EmptyRow>{q || category || stock ? "No products match these filters." : "No products yet."}</EmptyRow>
        )}
      </Section>
    </div>
  );
}
