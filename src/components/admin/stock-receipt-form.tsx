"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductCombobox } from "@/components/ui/product-combobox";
import { createStockReceipt, type StockReceiptFormState } from "@/lib/actions/stock-receipts";

type ProductOption = { id: string; name: string; imageUrl?: string | null; categoryName?: string };

let nextRowId = 0;

export function StockReceiptForm({ products }: { products: ProductOption[] }) {
  const initialState: StockReceiptFormState = null;
  const [state, formAction, isPending] = useActionState(createStockReceipt, initialState);
  const [rows, setRows] = useState(() => [{ key: nextRowId++ }]);

  // Reset the row list during render (not in the effect below) when a
  // successful submission comes back — see "you might not need an effect"
  // (react-hooks/set-state-in-effect flags setState calls inside effects).
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state?.ok) setRows([{ key: nextRowId++ }]);
  }

  useEffect(() => {
    if (state?.ok) toast.success("Stock added.");
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="reference">Batch / reference (optional)</Label>
          <Input id="reference" name="reference" placeholder="e.g. Batch #14" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="note">Note (optional)</Label>
          <Input id="note" name="note" placeholder="e.g. Finished production run" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Products</Label>
        {rows.map((row, i) => (
          <div key={row.key} className="flex items-center gap-2">
            <div className="flex-1">
              <ProductCombobox
                name="productId"
                required
                placeholder="Select product"
                options={products.map((p) => ({
                  value: p.id,
                  label: p.name,
                  imageUrl: p.imageUrl,
                  sublabel: p.categoryName,
                }))}
              />
            </div>
            <Input
              name="quantity"
              type="number"
              min="1"
              placeholder="Qty"
              required
              className="w-28"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={rows.length === 1}
              onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
              aria-label="Remove row"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => setRows((r) => [...r, { key: nextRowId++ }])}>
          <Plus className="h-3.5 w-3.5" /> Add product
        </Button>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Add stock"}
        </Button>
      </div>
    </form>
  );
}
