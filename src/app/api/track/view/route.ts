import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Best-effort product view counter. Called via `navigator.sendBeacon` from the
 * product detail page. Never throws to the client — analytics must not break
 * the page. */
export async function POST(request: Request) {
  try {
    const { productId } = await request.json();
    if (typeof productId === "string" && productId) {
      await prisma.product.update({
        where: { id: productId },
        data: { viewCount: { increment: 1 } },
      });
    }
  } catch {
    // Swallow — a missing product or bad payload shouldn't surface to visitors.
  }
  return NextResponse.json({ ok: true });
}
