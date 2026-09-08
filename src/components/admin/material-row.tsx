"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { renameMaterial, deleteMaterial } from "@/lib/actions/materials";

export function MaterialRow({
  id,
  name,
  nameBn,
  productCount,
  canEdit = true,
  canDelete = true,
}: {
  id: string;
  name: string;
  nameBn: string | null;
  productCount: number;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  const [editing, setEditing] = useState(false);

  async function handleRename(formData: FormData) {
    setEditing(false);
    try {
      await renameMaterial(formData);
      toast.success("Material updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update the material.");
    }
  }

  return (
    <li className="flex items-center justify-between gap-3 px-5 py-3">
      {editing ? (
        <form action={handleRename} className="flex flex-1 items-center gap-2">
          <input type="hidden" name="id" value={id} />
          <Input name="name" defaultValue={name} required autoFocus className="h-9 max-w-[10rem]" placeholder="Name" />
          <Input name="nameBn" defaultValue={nameBn ?? ""} className="h-9 max-w-[10rem]" placeholder="Bangla name (optional)" />
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
            <p className="truncate font-medium text-neutral-900">
              {name}
              {nameBn && <span className="ml-2 text-sm text-neutral-500">{nameBn}</span>}
            </p>
            <p className="text-sm text-neutral-500">
              {productCount} product{productCount === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
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
              (productCount === 0 ? (
                <form action={deleteMaterial}>
                  <input type="hidden" name="id" value={id} />
                  <ConfirmSubmit message={`Delete material "${name}"?`} variant="danger">
                    Delete
                  </ConfirmSubmit>
                </form>
              ) : (
                <span
                  title="Reassign or remove its products first"
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
