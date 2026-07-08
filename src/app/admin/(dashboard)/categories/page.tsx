import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, Section, SectionHeader, EmptyRow } from "@/components/admin/ui";
import { CategoryRow } from "@/components/admin/category-row";
import { createCategory } from "@/lib/actions/categories";

export const metadata = { title: "Categories" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader title="Categories" description="Group products by type. Categories with products can't be deleted until they're empty." />

      <Section className="p-4">
        <form action={createCategory} className="flex gap-2">
          <Input name="name" placeholder="New category name" required />
          <Button type="submit">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </form>
      </Section>

      <Section>
        <SectionHeader title="All categories" description={`${categories.length} total`} />
        <ul className="divide-y divide-neutral-100">
          {categories.map((c) => (
            <CategoryRow key={c.id} id={c.id} name={c.name} productCount={c._count.products} />
          ))}
          {categories.length === 0 && <EmptyRow>No categories yet.</EmptyRow>}
        </ul>
      </Section>
    </div>
  );
}
