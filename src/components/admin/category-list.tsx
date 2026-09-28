"use client";

import { useState } from "react";
import { CategoryRow } from "@/components/admin/category-row";
import { reorderCategories } from "@/lib/actions/categories";

type CategoryData = {
  id: string;
  name: string;
  shortCode: string;
  showOnHome: boolean;
  imageUrl: string | null;
  productCount: number;
};

/** Holds the ordered list client-side (for instant drag/keyboard reorder
 *  feedback) and persists the new order via reorderCategories — a plain
 *  callable server action, not a form, since a drag/drop or button click
 *  isn't a form submission. Up/Down buttons are real <button>s, so they're
 *  keyboard-operable for free; drag-and-drop is the mouse-only bonus on
 *  top, not the only way to reorder. */
export function CategoryList({
  categories,
  canEdit,
  canDelete,
}: {
  categories: CategoryData[];
  canEdit: boolean;
  canDelete: boolean;
}) {
  const [items, setItems] = useState(categories);
  const [dragId, setDragId] = useState<string | null>(null);

  function persist(next: CategoryData[]) {
    setItems(next);
    void reorderCategories(next.map((c) => c.id));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    persist(next);
  }

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      return;
    }
    const fromIndex = items.findIndex((c) => c.id === dragId);
    const toIndex = items.findIndex((c) => c.id === targetId);
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    persist(next);
    setDragId(null);
  }

  return (
    <ul className="divide-y divide-neutral-100">
      {items.map((c, i) => (
        <CategoryRow
          key={c.id}
          id={c.id}
          name={c.name}
          shortCode={c.shortCode}
          showOnHome={c.showOnHome}
          imageUrl={c.imageUrl}
          productCount={c.productCount}
          canEdit={canEdit}
          canDelete={canDelete}
          isFirst={i === 0}
          isLast={i === items.length - 1}
          onMoveUp={() => move(i, -1)}
          onMoveDown={() => move(i, 1)}
          draggable={canEdit}
          dragging={dragId === c.id}
          onDragStart={() => setDragId(c.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(c.id)}
        />
      ))}
    </ul>
  );
}
