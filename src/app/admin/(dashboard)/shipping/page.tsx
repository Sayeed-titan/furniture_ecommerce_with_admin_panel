import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, Section, SectionHeader, EmptyRow } from "@/components/admin/ui";
import { ShippingZoneRow } from "@/components/admin/shipping-zone-row";
import { createShippingZone } from "@/lib/actions/shipping";

export const metadata = { title: "Shipping" };
export const dynamic = "force-dynamic";

export default async function AdminShippingPage() {
  const { permissions } = await requirePermission("shipping.view");
  const canCreate = permissions.includes("shipping.create");
  const canEdit = permissions.includes("shipping.edit");
  const canDelete = permissions.includes("shipping.delete");

  const zones = await prisma.shippingZone.findMany({
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader
        title="Shipping"
        description='Delivery zones shown at checkout. A fee of 0 offers free shipping for that zone. The "Default" zone is pre-selected for the customer.'
      />

      {canCreate && (
        <Section className="p-4">
          <form action={createShippingZone} className="flex flex-wrap gap-2">
            <Input name="name" placeholder="Zone name (e.g. Inside Dhaka)" required className="max-w-[14rem]" />
            <Input name="fee" type="number" step="0.01" min="0" placeholder="Fee (BDT)" required defaultValue="0" className="max-w-[8rem]" />
            <Button type="submit">
              <Plus className="h-4 w-4" /> Add zone
            </Button>
          </form>
        </Section>
      )}

      <Section>
        <SectionHeader title="All zones" description={`${zones.length} total`} />
        <ul className="divide-y divide-neutral-100">
          {zones.map((z) => (
            <ShippingZoneRow
              key={z.id}
              id={z.id}
              name={z.name}
              fee={z.fee.toString()}
              isDefault={z.isDefault}
              orderCount={z._count.orders}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          ))}
          {zones.length === 0 && <EmptyRow>No shipping zones yet — add one above.</EmptyRow>}
        </ul>
      </Section>
    </div>
  );
}
