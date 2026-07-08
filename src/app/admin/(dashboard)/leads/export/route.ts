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

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: { select: { name: true } } } } },
  });

  const header = ["Name", "Email", "Phone", "Status", "Interested in", "Message", "Notes", "Created"];
  const rows = leads.map((l) =>
    [
      csv(l.name),
      csv(l.email),
      csv(l.phone),
      csv(l.status),
      csv(l.items.map((i) => i.product.name).join("; ")),
      csv(l.message),
      csv(l.notes),
      csv(l.createdAt.toISOString()),
    ].join(",")
  );

  const body = [header.map(csv).join(","), ...rows].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${date}.csv"`,
    },
  });
}
