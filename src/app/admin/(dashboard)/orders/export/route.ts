import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** Escape a value for CSV (quote, and double any inner quotes). */
function csv(value: string | null | undefined): string {
  const s = (value ?? "").replace(/"/g, '""');
  return `"${s}"`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const header = [
    "Order Number",
    "Customer",
    "Phone",
    "Status",
    "Payment Method",
    "Payment Status",
    "Items",
    "Subtotal",
    "Shipping",
    "Total",
    "Created",
  ];
  const rows = orders.map((o) =>
    [
      csv(o.orderNumber),
      csv(o.shipName),
      csv(o.shipPhone),
      csv(o.status),
      csv(o.paymentMethod),
      csv(o.paymentStatus),
      csv(o.items.map((i) => `${i.nameSnapshot} x${i.qty}`).join("; ")),
      csv(o.subtotal.toString()),
      csv(o.shippingFee.toString()),
      csv(o.total.toString()),
      csv(o.createdAt.toISOString()),
    ].join(",")
  );

  const body = [header.map(csv).join(","), ...rows].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${date}.csv"`,
    },
  });
}
