import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader, Section, SectionHeader, StatusPill, type PillTone } from "@/components/admin/ui";
import { updateOrderStatus } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/utils";
import { formatOrderStatus, formatPaymentMethod } from "@/lib/format";

export const metadata = { title: "Order Detail" };
export const dynamic = "force-dynamic";

const STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

const PAYMENT_TONE: Record<string, PillTone> = {
  PENDING: "amber",
  PAID: "green",
  FAILED: "red",
  CANCELLED: "red",
  REFUNDED: "red",
};

type Params = Promise<{ id: string }>;

export default async function AdminOrderDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payments: { orderBy: { createdAt: "desc" } }, customer: true },
  });

  if (!order) notFound();

  const updateStatus = updateOrderStatus.bind(null, order.id);

  return (
    <div className="space-y-5">
      <PageHeader
        title={order.orderNumber}
        description={`Placed ${order.createdAt.toLocaleString()}`}
      >
        <StatusPill tone={PAYMENT_TONE[order.paymentStatus] ?? "neutral"}>
          {formatOrderStatus(order.paymentStatus)}
        </StatusPill>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Section>
            <SectionHeader title="Items" />
            <ul className="divide-y divide-neutral-100">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                  <span>
                    {item.nameSnapshot} × {item.qty}
                  </span>
                  <span className="font-medium text-neutral-900">
                    {formatPrice(item.lineTotal.toString())}
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-1 border-t border-neutral-100 px-5 py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatPrice(order.subtotal.toString())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span>{formatPrice(order.shippingFee.toString())}</span>
              </div>
              <div className="flex justify-between font-semibold text-neutral-900">
                <span>Total</span>
                <span>{formatPrice(order.total.toString())}</span>
              </div>
            </div>
          </Section>

          <Section>
            <SectionHeader title="Shipping" />
            <div className="space-y-1 px-5 py-4 text-sm">
              <p className="font-medium text-neutral-900">{order.shipName}</p>
              <p className="text-neutral-600">{order.shipPhone}</p>
              <p className="text-neutral-600">
                {order.shipLine1}
                {order.shipLine2 ? `, ${order.shipLine2}` : ""}, {order.shipCity}
                {order.shipArea ? `, ${order.shipArea}` : ""}
                {order.shipPostCode ? ` ${order.shipPostCode}` : ""}
              </p>
              {order.notes && (
                <p className="mt-2 whitespace-pre-wrap rounded-md bg-neutral-50 p-3 text-neutral-700">
                  {order.notes}
                </p>
              )}
            </div>
          </Section>

          {order.payments.length > 0 && (
            <Section>
              <SectionHeader title="Payment activity" />
              <ul className="divide-y divide-neutral-100">
                {order.payments.map((payment) => (
                  <li key={payment.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                    <div>
                      <p className="text-neutral-900">
                        {formatPaymentMethod(payment.gateway)} · {payment.gatewayTxnId ?? "—"}
                      </p>
                      <p className="text-xs text-neutral-400">{payment.createdAt.toLocaleString()}</p>
                    </div>
                    <StatusPill tone={PAYMENT_TONE[payment.status] ?? "neutral"}>
                      {formatOrderStatus(payment.status)}
                    </StatusPill>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <div className="space-y-6">
          <Section>
            <SectionHeader title="Customer" />
            <div className="space-y-1 px-5 py-4 text-sm">
              <p className="font-medium text-neutral-900">{order.customer?.name ?? order.guestName ?? "Guest"}</p>
              {(order.customer?.email ?? order.guestEmail) && (
                <p className="text-neutral-600">{order.customer?.email ?? order.guestEmail}</p>
              )}
              <p className="text-neutral-600">{order.customer?.phone ?? order.guestPhone}</p>
              {!order.customer && (
                <p className="mt-1 text-xs text-neutral-400">Guest checkout</p>
              )}
            </div>
          </Section>

          <Section>
            <SectionHeader title="Order status" />
            <form action={updateStatus} className="flex flex-col gap-2 px-5 py-4">
              <select
                name="status"
                defaultValue={order.status}
                className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {formatOrderStatus(s)}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
              >
                Update status
              </button>
            </form>
          </Section>
        </div>
      </div>
    </div>
  );
}
