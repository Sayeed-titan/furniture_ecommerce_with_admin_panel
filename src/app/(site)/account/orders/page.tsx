import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AccountNav } from "@/components/site/account/account-nav";
import { EmptyState } from "@/components/site/empty-state";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { formatOrderStatus } from "@/lib/format";

export const metadata = { title: "Your Orders" };
export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const session = await auth();
  const customerId = (session?.user as { id?: string } | undefined)?.id;
  if (!customerId) return null;

  const orders = await prisma.order.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Your Account</h1>
      <AccountNav />

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Once you place an order, it'll show up here."
          action={
            <Button asChild size="sm" variant="outline">
              <Link href="/products">Browse Products</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.orderNumber}`}
              className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 hover:border-neutral-300"
            >
              <div>
                <p className="font-medium text-neutral-900">{order.orderNumber}</p>
                <p className="mt-1 text-sm text-neutral-500">
                  {order.items.length} item{order.items.length === 1 ? "" : "s"} ·{" "}
                  {order.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-neutral-900">
                  {formatPrice(order.total.toString())}
                </p>
                <p className="mt-1 text-sm text-neutral-500">{formatOrderStatus(order.status)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
