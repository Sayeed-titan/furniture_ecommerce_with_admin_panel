import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, Section, SectionHeader, EmptyRow } from "@/components/admin/ui";
import { CategoryList } from "@/components/admin/category-list";
import { createCategory } from "@/lib/actions/categories";

export const metadata = { title: "Categories" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const { permissions } = await requirePermission("categories.view");
  const canCreate = permissions.includes("categories.create");
  const canEdit = permissions.includes("categories.edit");
  const canDelete = permissions.includes("categories.delete");

  const categories = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader
        title="Categories"
        description="Group products by type. Drag or use the arrows to set the order shown on the homepage."
      />

      {canCreate && (
        <Section className="p-4">
          <form action={createCategory} className="flex gap-2">
            <Input name="name" placeholder="New category name" required className="flex-1" />
            <Input
              name="shortCode"
              placeholder="Code (e.g. SC)"
              title="Short code used in generated product codes — leave blank to auto-fill from the name"
              className="w-32 uppercase"
            />
            <Button type="submit">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </form>
        </Section>
      )}

      <Section>
        <SectionHeader title="All categories" description={`${categories.length} total`} />
        {categories.length === 0 ? (
          <EmptyRow>No categories yet.</EmptyRow>
        ) : (
          <CategoryList
            categories={categories.map((c) => ({
              id: c.id,
              name: c.name,
              shortCode: c.shortCode,
              showOnHome: c.showOnHome,
              imageUrl: c.imageUrl,
              productCount: c._count.products,
            }))}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        )}
      </Section>
    </div>
  );
}
