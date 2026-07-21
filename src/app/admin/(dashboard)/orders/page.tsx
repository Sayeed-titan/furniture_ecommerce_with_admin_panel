import Link from "next/link";
import { Download } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PageHeader, StatusPill, type PillTone } from "@/components/admin/ui";
import { formatPrice } from "@/lib/utils";
import { formatOrderStatus, formatPaymentMethod } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "Orders" };
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

const STATUS_TONE: Record<string, PillTone> = {
  PLACED: "blue",
  CONFIRMED: "purple",
  PROCESSING: "amber",
  SHIPPED: "amber",
  DELIVERED: "green",
  CANCELLED: "red",
  REFUNDED: "red",
};

const PAYMENT_TONE: Record<string, PillTone> = {
  PENDING: "amber",
  PAID: "green",
  FAILED: "red",
  CANCELLED: "red",
  REFUNDED: "red",
};

type SearchParams = Promise<{ status?: string }>;

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const { status } = await searchParams;
  const activeStatus = STATUSES.includes(status as (typeof STATUSES)[number]) ? status : undefined;

  const where: Prisma.OrderWhereInput = activeStatus
    ? { status: activeStatus as Prisma.EnumOrderStatusFilter["equals"] }
    : {};

  const [orders, counts] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
  ]);

  const countFor = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;
  const total = counts.reduce((sum, c) => sum + c._count, 0);

  const tabs = [
    { key: undefined, label: "All", count: total },
    ...STATUSES.map((s) => ({ key: s, label: formatOrderStatus(s), count: countFor(s) })),
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Orders" description="Every order placed on the site, newest first.">
        {total > 0 && (
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- CSV download, not a page transition; shares a URL prefix with the [id] dynamic route
          <a
            href="/admin/orders/export"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100"
          >
            <Download className="h-4 w-4" /> Export CSV
          </a>
        )}
      </PageHeader>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = activeStatus === tab.key || (!activeStatus && tab.key === undefined);
          return (
            <Link
              key={tab.label}
              href={tab.key ? `/admin/orders?status=${tab.key}` : "/admin/orders"}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
              )}
            >
              {tab.label}
              <span className={cn("text-xs", active ? "text-white/70" : "text-neutral-400")}>{tab.count}</span>
            </Link>
          );
        })}
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-5 hover:border-neutral-300"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-neutral-900">{order.orderNumber}</p>
                <StatusPill tone={STATUS_TONE[order.status] ?? "neutral"}>
                  {formatOrderStatus(order.status)}
                </StatusPill>
                <StatusPill tone={PAYMENT_TONE[order.paymentStatus] ?? "neutral"}>
                  {formatOrderStatus(order.paymentStatus)}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm text-neutral-500">
                {order.shipName} · {order.items.length} item{order.items.length === 1 ? "" : "s"} ·{" "}
                {formatPaymentMethod(order.paymentMethod)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-neutral-900">{formatPrice(order.total.toString())}</p>
              <p className="text-xs text-neutral-400">{order.createdAt.toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
        {orders.length === 0 && (
          <p className="rounded-xl border border-dashed border-neutral-300 py-16 text-center text-sm text-neutral-500">
            {activeStatus ? `No ${formatOrderStatus(activeStatus).toLowerCase()} orders.` : "No orders yet."}
          </p>
        )}
      </div>
    </div>
  );
}
