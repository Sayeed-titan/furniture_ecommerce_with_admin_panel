"use server";

import { revalidatePath, refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";
import { deriveStockStatus } from "@/lib/stock";

export type StockReceiptFormState = { error?: string; ok?: boolean } | null;

/**
 * Records a stock-in event (this business manufactures its own furniture,
 * so there's no external supplier/PO to reference — just an optional
 * internal batch note) and applies each line's quantity to the product,
 * going through the same deriveStockStatus() as adjustStock/product-form so
 * stockStatus never drifts from the real quantity.
 */
export async function createStockReceipt(
  _prevState: StockReceiptFormState,
  formData: FormData
): Promise<StockReceiptFormState> {
  const { user } = await requirePermission("stock.create");

  const reference = String(formData.get("reference") ?? "").trim() || null;
  const note = String(formData.get("note") ?? "").trim() || null;

  const productIds = formData.getAll("productId").map(String);
  const quantities = formData.getAll("quantity").map((v) => Number(v));

  const lines = productIds
    .map((productId, i) => ({ productId, quantity: quantities[i] }))
    .filter((l) => l.productId && Number.isFinite(l.quantity) && l.quantity > 0);

  if (lines.length === 0) {
    return { error: "Add at least one product with a quantity greater than 0." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.stockReceipt.create({
      data: {
        reference,
        note,
        createdById: user?.id ?? null,
        items: { create: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })) },
      },
    });

    for (const line of lines) {
      const product = await tx.product.findUnique({
        where: { id: line.productId },
        select: { stockQty: true, reorderLevel: true, stockStatus: true },
      });
      if (!product) continue;
      const newQty = product.stockQty + line.quantity;
      const newStatus = deriveStockStatus(newQty, product.reorderLevel, product.stockStatus === "MADE_TO_ORDER");
      await tx.product.update({
        where: { id: line.productId },
        data: { stockQty: newQty, stockStatus: newStatus },
      });
    }
  });

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  refresh();

  return { ok: true };
}
