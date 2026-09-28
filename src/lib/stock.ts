import type { StockStatus } from "@prisma/client";

/** The one place stockStatus is decided. MADE_TO_ORDER is the only manual
 *  override — every other status is derived from quantity vs. reorder
 *  level, so the admin can never save a status that disagrees with the
 *  actual quantity (see TODO.md "Stock shown in admin doesn't match..."). */
export function deriveStockStatus(stockQty: number, reorderLevel: number, madeToOrder: boolean): StockStatus {
  if (madeToOrder) return "MADE_TO_ORDER";
  if (stockQty <= 0) return "OUT_OF_STOCK";
  if (stockQty <= reorderLevel) return "LOW_STOCK";
  return "IN_STOCK";
}
