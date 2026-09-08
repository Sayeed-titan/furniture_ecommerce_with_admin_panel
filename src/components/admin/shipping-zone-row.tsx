"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/admin/ui";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { formatPrice } from "@/lib/utils";
import { updateShippingZone, setDefaultShippingZone, deleteShippingZone } from "@/lib/actions/shipping";

export function ShippingZoneRow({
  id,
  name,
  fee,
  isDefault,
  orderCount,
  canEdit = true,
  canDelete = true,
}: {
  id: string;
  name: string;
  fee: string;
  isDefault: boolean;
  orderCount: number;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  const [editing, setEditing] = useState(false);

  async function handleUpdate(formData: FormData) {
    setEditing(false);
    try {
      await updateShippingZone(formData);
      toast.success("Shipping zone updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update the zone.");
    }
  }

  async function handleSetDefault(formData: FormData) {
    try {
      await setDefaultShippingZone(formData);
      toast.success(`"${name}" is now the default zone.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't set the default zone.");
    }
  }

  return (
    <li className="flex items-center justify-between gap-3 px-5 py-3">
      {editing ? (
        <form action={handleUpdate} className="flex flex-1 flex-wrap items-center gap-2">
          <input type="hidden" name="id" value={id} />
          <Input name="name" defaultValue={name} required autoFocus className="h-9 max-w-[10rem]" placeholder="Zone name" />
          <Input name="fee" type="number" step="0.01" min="0" defaultValue={fee} required className="h-9 max-w-[8rem]" placeholder="Fee" />
          <button type="submit" aria-label="Save" className="rounded-md p-2 text-emerald-600 hover:bg-emerald-50">
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            aria-label="Cancel"
            className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100"
          >
            <X className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <>
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-medium text-neutral-900">
              {name}
              {isDefault && <StatusPill tone="blue">Default</StatusPill>}
              {Number(fee) === 0 && <StatusPill tone="green">Free</StatusPill>}
            </p>
            <p className="text-sm text-neutral-500">
              {formatPrice(fee)} · {orderCount} order{orderCount === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {canEdit && !isDefault && (
              <form action={handleSetDefault}>
                <input type="hidden" name="id" value={id} />
                <button
                  type="submit"
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
                >
                  Make default
                </button>
              </form>
            )}
            {canEdit && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
            )}
            {canDelete &&
              (orderCount === 0 ? (
                <form action={deleteShippingZone}>
                  <input type="hidden" name="id" value={id} />
                  <ConfirmSubmit message={`Delete shipping zone "${name}"?`} variant="danger">
                    Delete
                  </ConfirmSubmit>
                </form>
              ) : (
                <span
                  title="Orders already reference this zone"
                  className="cursor-not-allowed px-3 py-1.5 text-sm font-medium text-neutral-300"
                >
                  Delete
                </span>
              ))}
          </div>
        </>
      )}
    </li>
  );
}
