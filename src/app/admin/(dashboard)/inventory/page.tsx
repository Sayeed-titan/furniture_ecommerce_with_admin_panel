import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";
import { PageHeader, Section, SectionHeader, EmptyRow } from "@/components/admin/ui";
import { StockReceiptForm } from "@/components/admin/stock-receipt-form";

export const metadata = { title: "Stock In" };
export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const { permissions } = await requirePermission("stock.view");
  const canCreate = permissions.includes("stock.create");

  const [products, receipts] = await Promise.all([
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        category: { select: { name: true } },
        images: { where: { type: "IMAGE" }, orderBy: { position: "asc" }, take: 1, select: { url: true } },
      },
    }),
    prisma.stockReceipt.findMany({
      orderBy: { receivedAt: "desc" },
      take: 50,
      include: {
        createdBy: { select: { name: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    }),
  ]);

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader
        title="Stock In"
        description="Add finished furniture into inventory as it comes off production — this business makes its own stock, so there's no supplier to log, just what and how much came in."
      />

      {canCreate && (
        <Section className="p-5">
          <StockReceiptForm
            products={products.map((p) => ({
              id: p.id,
              name: p.name,
              imageUrl: p.images[0]?.url ?? null,
              categoryName: p.category.name,
            }))}
          />
        </Section>
      )}

      <Section>
        <SectionHeader title="History" description={`${receipts.length} most recent`} />
        <ul className="divide-y divide-neutral-100">
          {receipts.map((r) => (
            <li key={r.id} className="space-y-1.5 px-5 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-neutral-900">
                  {r.reference || "Stock added"}
                </p>
                <p className="text-xs text-neutral-500">
                  {r.receivedAt.toLocaleDateString()} {r.createdBy?.name ? `· ${r.createdBy.name}` : ""}
                </p>
              </div>
              <p className="text-sm text-neutral-600">
                {r.items.map((it) => `${it.product.name} (+${it.quantity})`).join(", ")}
              </p>
              {r.note && <p className="text-xs text-neutral-500">{r.note}</p>}
            </li>
          ))}
          {receipts.length === 0 && <EmptyRow>No stock added yet.</EmptyRow>}
        </ul>
      </Section>
    </div>
  );
}
