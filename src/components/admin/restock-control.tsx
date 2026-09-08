"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PackagePlus } from "lucide-react";
import { adjustStock } from "@/lib/actions/products";

/** Quick "+ qty" restock control for an existing product — adds units to
 *  stockQty without needing to open the full edit form. */
export function RestockControl({ productId, stockQty }: { productId: string; stockQty: number }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("10");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const delta = Number(amount);
    if (!Number.isFinite(delta) || delta === 0) return;
    setPending(true);
    try {
      const data = new FormData();
      data.set("id", productId);
      data.set("delta", String(delta));
      await adjustStock(data);
      toast.success(`Stock updated to ${stockQty + delta}.`);
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update stock.");
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Restock — add units to existing stock"
        className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
      >
        <PackagePlus className="h-3 w-3" /> Restock
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        autoFocus
        className="h-6 w-14 rounded border border-neutral-300 px-1 text-xs"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-neutral-900 px-1.5 py-0.5 text-xs font-medium text-white disabled:opacity-50"
      >
        Add
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="rounded px-1.5 py-0.5 text-xs text-neutral-500 hover:bg-neutral-100"
      >
        Cancel
      </button>
    </form>
  );
}
