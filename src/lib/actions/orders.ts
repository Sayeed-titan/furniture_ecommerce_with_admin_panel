"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendNotification, escapeHtml } from "@/lib/email";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus, PaymentMethod } from "@prisma/client";

export type PlaceOrderState = { error?: string };

function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PF-${y}${m}${d}-${rand}`;
}

export async function placeOrder(
  _prev: PlaceOrderState,
  formData: FormData
): Promise<PlaceOrderState> {
  let cartItems: { productId: string; qty: number }[];
  try {
    cartItems = JSON.parse(String(formData.get("cartItems") ?? "[]"));
  } catch {
    return { error: "Your cart data is invalid. Please refresh and try again." };
  }
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { error: "Your cart is empty." };
  }

  const shipName = String(formData.get("shipName") ?? "").trim();
  const shipPhone = String(formData.get("shipPhone") ?? "").trim();
  const shipLine1 = String(formData.get("shipLine1") ?? "").trim();
  const shipLine2 = String(formData.get("shipLine2") ?? "").trim() || null;
  const shipCity = String(formData.get("shipCity") ?? "").trim();
  const shipArea = String(formData.get("shipArea") ?? "").trim() || null;
  const shipPostCode = String(formData.get("shipPostCode") ?? "").trim() || null;
  const guestEmail = String(formData.get("guestEmail") ?? "").trim() || null;
  const paymentMethod = String(formData.get("paymentMethod") ?? "COD") as PaymentMethod;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!shipName || !shipPhone || !shipLine1 || !shipCity) {
    return { error: "Please fill in all required shipping details." };
  }

  const session = await auth();
  const user = session?.user as { id?: string; userType?: string } | undefined;
  const customerId = user?.userType === "customer" ? user.id : undefined;

  const productIds = [...new Set(cartItems.map((i) => i.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  let lineItems: {
    productId: string;
    nameSnapshot: string;
    priceSnapshot: number;
    qty: number;
    lineTotal: number;
    madeToOrder: boolean;
  }[];

  try {
    lineItems = cartItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error("One of the items in your cart is no longer available.");
      if (product.stockStatus === "OUT_OF_STOCK") {
        throw new Error(`${product.name} is out of stock.`);
      }
      if (product.stockStatus !== "MADE_TO_ORDER" && product.stockQty < item.qty) {
        throw new Error(`Only ${product.stockQty} of ${product.name} left in stock.`);
      }
      const price = Number(product.price);
      return {
        productId: product.id,
        nameSnapshot: product.name,
        priceSnapshot: price,
        qty: item.qty,
        lineTotal: price * item.qty,
        madeToOrder: product.stockStatus === "MADE_TO_ORDER",
      };
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not validate your cart." };
  }

  const subtotal = lineItems.reduce((sum, li) => sum + li.lineTotal, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;
  const orderNumber = generateOrderNumber();

  let order;
  try {
    order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          customerId: customerId ?? null,
          guestName: customerId ? null : shipName,
          guestEmail: customerId ? null : guestEmail,
          guestPhone: customerId ? null : shipPhone,
          shipName,
          shipPhone,
          shipLine1,
          shipLine2,
          shipCity,
          shipArea,
          shipPostCode,
          subtotal,
          shippingFee,
          total,
          paymentMethod,
          notes,
          items: {
            create: lineItems.map((li) => ({
              productId: li.productId,
              nameSnapshot: li.nameSnapshot,
              priceSnapshot: li.priceSnapshot,
              qty: li.qty,
              lineTotal: li.lineTotal,
            })),
          },
        },
      });

      for (const li of lineItems) {
        if (li.madeToOrder) continue;
        await tx.product.update({
          where: { id: li.productId },
          data: { stockQty: { decrement: li.qty } },
        });
      }

      return created;
    });
  } catch {
    return { error: "Could not place your order. Please try again." };
  }

  // Best-effort notification to the business — never blocks the response.
  await sendNotification({
    subject: `New order: ${order.orderNumber}`,
    replyTo: guestEmail ?? undefined,
    html: `
      <h2>New order</h2>
      <p><strong>Order:</strong> ${order.orderNumber}</p>
      <p><strong>Customer:</strong> ${escapeHtml(shipName)} (${escapeHtml(shipPhone)})</p>
      <p><strong>Total:</strong> ${formatPrice(total)}</p>
      <p><strong>Payment:</strong> ${paymentMethod === "COD" ? "Cash on Delivery" : "Online (SSLCommerz)"}</p>
      <p><strong>Ship to:</strong><br/>${escapeHtml(shipLine1)}${shipLine2 ? `, ${escapeHtml(shipLine2)}` : ""}, ${escapeHtml(shipCity)}</p>
      <ul>${lineItems.map((li) => `<li>${escapeHtml(li.nameSnapshot)} × ${li.qty}</li>`).join("")}</ul>
    `,
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");

  if (paymentMethod === "SSLCOMMERZ") {
    redirect(`/checkout/pay/${order.orderNumber}`);
  }

  redirect(`/order/confirmation/${order.orderNumber}`);
}

export async function updateOrderStatus(id: string, formData: FormData) {
  const status = String(formData.get("status")) as OrderStatus;

  await prisma.order.update({ where: { id }, data: { status } });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
