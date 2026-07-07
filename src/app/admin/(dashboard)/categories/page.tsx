import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory, deleteCategory } from "@/lib/actions/categories";

export const metadata = { title: "Categories" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>

      <form action={createCategory} className="mt-6 flex gap-2">
        <Input name="name" placeholder="New category name" required />
        <Button type="submit">Add</Button>
      </form>

      <ul className="mt-6 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-neutral-500">
                {c._count.products} product{c._count.products === 1 ? "" : "s"}
              </p>
            </div>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={c.id} />
              <Button type="submit" variant="ghost" size="sm">
                Delete
              </Button>
            </form>
          </li>
        ))}
        {categories.length === 0 && (
          <li className="px-4 py-6 text-sm text-neutral-500">No categories yet.</li>
        )}
      </ul>
    </div>
  );
}
