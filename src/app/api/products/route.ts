import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");

  if (!idsParam) {
    return NextResponse.json({ products: [] });
  }

  const ids = idsParam.split(",").filter(Boolean);
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });

  return NextResponse.json({ products });
}
