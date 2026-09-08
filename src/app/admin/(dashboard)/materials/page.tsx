import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, Section, SectionHeader, EmptyRow } from "@/components/admin/ui";
import { MaterialRow } from "@/components/admin/material-row";
import { createMaterial } from "@/lib/actions/materials";

export const metadata = { title: "Materials" };
export const dynamic = "force-dynamic";

export default async function AdminMaterialsPage() {
  const { permissions } = await requirePermission("materials.view");
  const canCreate = permissions.includes("materials.create");
  const canEdit = permissions.includes("materials.edit");
  const canDelete = permissions.includes("materials.delete");

  const materials = await prisma.material.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader
        title="Materials"
        description="The material dropdown shown when adding or editing a product. Materials with products can't be deleted until they're empty."
      />

      {canCreate && (
        <Section className="p-4">
          <form action={createMaterial} className="flex flex-wrap gap-2">
            <Input name="name" placeholder="Name (e.g. Solid Wood)" required className="max-w-[12rem]" />
            <Input name="nameBn" placeholder="Bangla name (optional)" className="max-w-[12rem]" />
            <Button type="submit">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </form>
        </Section>
      )}

      <Section>
        <SectionHeader title="All materials" description={`${materials.length} total`} />
        <ul className="divide-y divide-neutral-100">
          {materials.map((m) => (
            <MaterialRow
              key={m.id}
              id={m.id}
              name={m.name}
              nameBn={m.nameBn}
              productCount={m._count.products}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          ))}
          {materials.length === 0 && <EmptyRow>No materials yet.</EmptyRow>}
        </ul>
      </Section>
    </div>
  );
}
