"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X, Pencil, GripVertical, ChevronUp, ChevronDown, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { CategoryImageField } from "@/components/admin/category-image-field";
import { renameCategory, deleteCategory } from "@/lib/actions/categories";

export function CategoryRow({
  id,
  name,
  shortCode,
  showOnHome,
  imageUrl,
  productCount,
  canEdit = true,
  canDelete = true,
  isFirst = false,
  isLast = false,
  onMoveUp,
  onMoveDown,
  draggable = false,
  dragging = false,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  id: string;
  name: string;
  shortCode: string;
  showOnHome: boolean;
  imageUrl: string | null;
  productCount: number;
  canEdit?: boolean;
  canDelete?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  draggable?: boolean;
  dragging?: boolean;
  onDragStart?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: () => void;
}) {
  const [editing, setEditing] = useState(false);

  async function handleRename(formData: FormData) {
    setEditing(false);
    try {
      await renameCategory(formData);
      toast.success("Category updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update the category.");
    }
  }

  return (
    <li
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`px-5 py-3 ${dragging ? "opacity-40" : ""}`}
    >
      {editing ? (
        <form action={handleRename} className="space-y-2">
          <input type="hidden" name="id" value={id} />
          <div className="flex flex-wrap items-center gap-2">
            <Input name="name" defaultValue={name} required autoFocus className="h-9 max-w-xs" placeholder="Name" />
            <Input
              name="shortCode"
              defaultValue={shortCode}
              placeholder="Code"
              title="Short code used in generated product codes"
              className="h-9 w-20 uppercase"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-neutral-500">Homepage tile image:</span>
            <CategoryImageField name="imageUrl" defaultValue={imageUrl} />
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input type="checkbox" name="showOnHome" defaultChecked={showOnHome} className="h-4 w-4 rounded border-neutral-300" />
            Show in the homepage category section
          </label>
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              <Check className="h-3.5 w-3.5" /> Save
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
              <X className="h-3.5 w-3.5" /> Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {draggable && (
              <span className="cursor-grab text-neutral-300" title="Drag to reorder">
                <GripVertical className="h-4 w-4" />
              </span>
            )}
            <div className="flex flex-col">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                disabled={isFirst}
                onClick={onMoveUp}
                aria-label="Move up"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                disabled={isLast}
                onClick={onMoveDown}
                aria-label="Move down"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-2 truncate font-medium text-neutral-900">
                {name}
                <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs font-medium text-neutral-500">
                  {shortCode}
                </span>
                {!showOnHome && (
                  <span className="flex items-center gap-1 text-xs text-neutral-400" title="Hidden from the homepage category section">
                    <EyeOff className="h-3 w-3" /> Hidden
                  </span>
                )}
              </p>
              <p className="text-sm text-neutral-500">
                {productCount} product{productCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {canEdit && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(true)}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            )}
            {canDelete &&
              (productCount === 0 ? (
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
              ))}
          </div>
        </div>
      )}
    </li>
  );
}
