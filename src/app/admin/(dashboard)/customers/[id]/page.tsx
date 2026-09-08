import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";
import { PageHeader, Section, SectionHeader, StatusPill, EmptyRow, type PillTone } from "@/components/admin/ui";
import { SendResetLinkButton } from "@/components/admin/send-reset-link-button";
import { formatPrice } from "@/lib/utils";
import { formatOrderStatus } from "@/lib/format";

export const metadata = { title: "Customer Detail" };
export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, PillTone> = {
  PLACED: "blue",
  CONFIRMED: "purple",
  PROCESSING: "amber",
  SHIPPED: "amber",
  DELIVERED: "green",
  CANCELLED: "red",
  REFUNDED: "red",
};

type Params = Promise<{ id: string }>;

export default async function AdminCustomerDetailPage({ params }: { params: Params }) {
  const { permissions } = await requirePermission("customers.view");
  const canEdit = permissions.includes("customers.edit");
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] },
      orders: { orderBy: { createdAt: "desc" }, include: { items: true } },
    },
  });

  if (!customer) notFound();

  const totalSpent = customer.orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/customers"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" /> Customers
        </Link>
        <PageHeader title={customer.name} description={`Joined ${customer.createdAt.toLocaleDateString()}`}>
          {canEdit && customer.passwordHash && (
            <SendResetLinkButton customerId={customer.id} name={customer.name} />
          )}
        </PageHeader>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Section>
            <SectionHeader title="Order history" description={`${customer.orders.length} total · ${formatPrice(totalSpent)} paid`} />
            {customer.orders.length === 0 ? (
              <EmptyRow>No orders yet.</EmptyRow>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {customer.orders.map((order) => (
                  <li key={order.id}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-neutral-50/60"
                    >
                      <div>
                        <p className="font-medium text-neutral-900">{order.orderNumber}</p>
                        <p className="text-sm text-neutral-500">
                          {order.items.length} item{order.items.length === 1 ? "" : "s"} ·{" "}
                          {order.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusPill tone={STATUS_TONE[order.status] ?? "neutral"}>
                          {formatOrderStatus(order.status)}
                        </StatusPill>
                        <span className="font-medium text-neutral-900">{formatPrice(order.total.toString())}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        <div className="space-y-6">
          <Section>
            <SectionHeader title="Contact" />
            <div className="space-y-1 px-5 py-4 text-sm">
              <p className="text-neutral-600">{customer.email}</p>
              <p className="text-neutral-600">{customer.phone ?? "No phone on file"}</p>
              <p className="mt-1">
                <StatusPill tone={customer.passwordHash ? "green" : "neutral"}>
                  {customer.passwordHash ? "Registered account" : "Guest — no password set"}
                </StatusPill>
              </p>
            </div>
          </Section>

          <Section>
            <SectionHeader title="Addresses" />
            {customer.addresses.length === 0 ? (
              <EmptyRow>No saved addresses.</EmptyRow>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {customer.addresses.map((a) => (
                  <li key={a.id} className="space-y-1 px-5 py-3 text-sm">
                    <p className="flex items-center gap-2 font-medium text-neutral-900">
                      {a.label ?? a.recipientName}
                      {a.isDefault && <StatusPill tone="blue">Default</StatusPill>}
                    </p>
                    <p className="text-neutral-600">{a.recipientName} · {a.phone}</p>
                    <p className="text-neutral-600">
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ""}, {a.city}
                      {a.area ? `, ${a.area}` : ""}
                      {a.postCode ? ` ${a.postCode}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
