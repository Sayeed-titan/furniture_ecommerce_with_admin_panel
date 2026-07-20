import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AccountNav } from "@/components/site/account/account-nav";
import { formatPrice } from "@/lib/utils";
import { formatOrderStatus, formatPaymentMethod } from "@/lib/format";

export const metadata = { title: "Order Details" };
export const dynamic = "force-dynamic";

type Params = Promise<{ orderNumber: string }>;

export default async function AccountOrderDetailPage({ params }: { params: Params }) {
  const { orderNumber } = await params;
  const session = await auth();
  const customerId = (session?.user as { id?: string } | undefined)?.id;
  if (!customerId) return null;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true, payments: true },
  });

  if (!order || order.customerId !== customerId) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Your Account</h1>
      <AccountNav />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-900">{order.orderNumber}</h2>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
          {formatOrderStatus(order.status)}
        </span>
      </div>
      <p className="mt-1 text-sm text-neutral-500">
        Placed {order.createdAt.toLocaleDateString()} · {formatPaymentMethod(order.paymentMethod)} ·{" "}
        {formatOrderStatus(order.paymentStatus)}
      </p>

      <div className="mt-6 divide-y divide-neutral-200 rounded-xl border border-neutral-200">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 text-sm">
            <div>
              <p className="font-medium text-neutral-900">{item.nameSnapshot}</p>
              <p className="text-neutral-500">
                {formatPrice(item.priceSnapshot.toString())} × {item.qty}
              </p>
            </div>
            <p className="font-semibold text-neutral-900">{formatPrice(item.lineTotal.toString())}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1 rounded-xl border border-neutral-200 p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-600">Subtotal</span>
          <span>{formatPrice(order.subtotal.toString())}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-600">Shipping</span>
          <span>{formatPrice(order.shippingFee.toString())}</span>
        </div>
        <div className="flex justify-between font-semibold text-neutral-900">
          <span>Total</span>
          <span>{formatPrice(order.total.toString())}</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-neutral-200 p-4 text-sm">
        <p className="font-medium text-neutral-900">Shipping to</p>
        <p className="mt-1 text-neutral-600">{order.shipName}</p>
        <p className="text-neutral-600">{order.shipPhone}</p>
        <p className="text-neutral-600">
          {order.shipLine1}
          {order.shipLine2 ? `, ${order.shipLine2}` : ""}, {order.shipCity}
          {order.shipArea ? `, ${order.shipArea}` : ""}
          {order.shipPostCode ? ` ${order.shipPostCode}` : ""}
        </p>
      </div>
    </div>
  );
}
