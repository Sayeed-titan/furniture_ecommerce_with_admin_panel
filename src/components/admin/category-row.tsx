"use client";

import { useState } from "react";
import { Check, X, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { renameCategory, deleteCategory } from "@/lib/actions/categories";

export function CategoryRow({
  id,
  name,
  productCount,
}: {
  id: string;
  name: string;
  productCount: number;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <li className="flex items-center justify-between gap-3 px-5 py-3">
      {editing ? (
        <form
          action={renameCategory}
          onSubmit={() => setEditing(false)}
          className="flex flex-1 items-center gap-2"
        >
          <input type="hidden" name="id" value={id} />
          <Input name="name" defaultValue={name} required autoFocus className="h-9 max-w-xs" />
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
            <p className="truncate font-medium text-neutral-900">{name}</p>
            <p className="text-sm text-neutral-500">
              {productCount} product{productCount === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
            >
              <Pencil className="h-3.5 w-3.5" /> Rename
            </button>
            {productCount === 0 ? (
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={id} />
                <ConfirmSubmit message={`Delete category "${name}"?`} variant="danger">
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
            )}
          </div>
        </>
      )}
    </li>
  );
}
