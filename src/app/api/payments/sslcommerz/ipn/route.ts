import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { validateTransaction, type ValidationResult } from "@/lib/payment/sslcommerz";

function toJsonInput(value: ValidationResult | null): Prisma.InputJsonValue | undefined {
  return value ? (JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue) : undefined;
}

/**
 * SSLCommerz's server-to-server payment notification. This — not the
 * browser success-redirect — is the source of truth for whether a payment
 * actually went through, since a redirect can be spoofed by the shopper.
 */
export async function POST(request: Request) {
  let tranId: string | null = null;
  let valId: string | null = null;

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}) as Record<string, unknown>);
    tranId = String(body.tran_id ?? "") || null;
    valId = String(body.val_id ?? "") || null;
  } else {
    const formData = await request.formData().catch(() => null);
    tranId = formData ? String(formData.get("tran_id") ?? "") || null : null;
    valId = formData ? String(formData.get("val_id") ?? "") || null : null;
  }

  if (!tranId || !valId) {
    return NextResponse.json({ error: "Missing tran_id or val_id" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { orderNumber: tranId } });
  if (!order) {
    return NextResponse.json({ error: "Unknown order" }, { status: 404 });
  }

  const validation = await validateTransaction(valId);
  const validStatus = validation?.status === "VALID" || validation?.status === "VALIDATED";
  const amountMatches =
    validation?.amount !== undefined &&
    Math.abs(Number(validation.amount) - Number(order.total)) < 1;

  if (!validStatus || !amountMatches) {
    await prisma.payment.create({
      data: {
        orderId: order.id,
        gateway: "SSLCOMMERZ",
        gatewayTxnId: tranId,
        valId,
        amount: order.total,
        status: "FAILED",
        rawPayload: toJsonInput(validation),
      },
    });
    return NextResponse.json({ ok: true, applied: false });
  }

  await prisma.$transaction([
    prisma.payment.create({
      data: {
        orderId: order.id,
        gateway: "SSLCOMMERZ",
        gatewayTxnId: tranId,
        valId,
        amount: order.total,
        status: "PAID",
        rawPayload: toJsonInput(validation),
      },
    }),
    prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        status: order.status === "PLACED" ? "CONFIRMED" : order.status,
      },
    }),
  ]);

  return NextResponse.json({ ok: true, applied: true });
}
