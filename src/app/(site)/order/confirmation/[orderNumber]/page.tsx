import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ClearCartOnMount } from "@/components/site/checkout/clear-cart-on-mount";

export const metadata = { title: "Order Confirmed" };
export const dynamic = "force-dynamic";

type Params = Promise<{ orderNumber: string }>;

export default async function OrderConfirmationPage({ params }: { params: Params }) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <ClearCartOnMount />
      <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Order placed!</h1>
      <p className="mt-2 text-neutral-600">
        Thanks, {order.shipName.split(" ")[0]}. Your order <strong>{order.orderNumber}</strong> has
        been received and we&apos;ll be in touch to confirm delivery.
      </p>

      <div className="mt-8 divide-y divide-neutral-200 rounded-xl border border-neutral-200 text-left">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 text-sm">
            <span>
              {item.nameSnapshot} × {item.qty}
            </span>
            <span className="font-medium">{formatPrice(item.lineTotal.toString())}</span>
          </div>
        ))}
        <div className="flex items-center justify-between p-4 text-sm font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total.toString())}</span>
        </div>
      </div>

      <Button asChild className="mt-8">
        <Link href="/products">Continue shopping</Link>
      </Button>
    </div>
  );
}
