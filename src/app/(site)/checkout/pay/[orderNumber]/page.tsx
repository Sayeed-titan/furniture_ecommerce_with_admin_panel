import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { initSession, isSslcommerzConfigured } from "@/lib/payment/sslcommerz";

export const dynamic = "force-dynamic";

type Params = Promise<{ orderNumber: string }>;

function siteUrl() {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

export default async function CheckoutPayPage({ params }: { params: Params }) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order || order.paymentMethod !== "SSLCOMMERZ") notFound();

  // Already paid or already progressed past payment — just show the receipt.
  if (order.paymentStatus === "PAID") {
    redirect(`/order/confirmation/${order.orderNumber}`);
  }

  if (!isSslcommerzConfigured()) {
    redirect(`/checkout/fail?order=${order.orderNumber}&reason=not_configured`);
  }

  const base = siteUrl();

  let gatewayUrl: string;
  try {
    const session = await initSession({
      orderNumber: order.orderNumber,
      amount: Number(order.total),
      customerName: order.shipName,
      customerEmail: order.guestEmail ?? "",
      customerPhone: order.shipPhone,
      customerAddress: order.shipLine1,
      customerCity: order.shipCity,
      successUrl: `${base}/api/payments/sslcommerz/success`,
      failUrl: `${base}/api/payments/sslcommerz/fail`,
      cancelUrl: `${base}/api/payments/sslcommerz/cancel`,
      ipnUrl: `${base}/api/payments/sslcommerz/ipn`,
    });
    gatewayUrl = session.gatewayUrl;
  } catch {
    redirect(`/checkout/fail?order=${order.orderNumber}&reason=init_failed`);
  }

  redirect(gatewayUrl);
}
