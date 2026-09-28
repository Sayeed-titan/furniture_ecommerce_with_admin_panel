"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { MultiCombobox } from "@/components/ui/multi-combobox";
import { Section, StatusPill } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/image-field";
import { formatPrice, discountPercent } from "@/lib/utils";
import type { ProductFormState } from "@/lib/actions/products";

type Category = { id: string; name: string };
type MaterialOption = { id: string; name: string };

// HEALTHCARE is kept selectable here (unlike the public product-filters
// dropdown) even though President Furniture no longer markets hospital
// furniture — removing it would make the <select> silently fall back to
// the first option for any existing HEALTHCARE-tagged product opened for
// editing, corrupting its room on save without anyone touching the field.
const rooms = ["OFFICE", "WORKSPACE", "CONFERENCE", "RECEPTION", "HEALTHCARE", "INDUSTRIAL"];

const selectClass =
  "flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Section className="p-5">
      <h2 className="mb-4 text-sm font-semibold text-neutral-900">{title}</h2>
      {children}
    </Section>
  );
}

export function ProductForm({
  categories,
  materials,
  action,
  defaultValues,
  showImageField = true,
  submitLabel,
}: {
  categories: Category[];
  materials: MaterialOption[];
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  defaultValues?: {
    name: string;
    description: string;
    price: number | string;
    compareAtPrice?: number | string | null;
    materialId: string;
    room: string;
    color?: string | null;
    dimensions?: string | null;
    deliveryEstimate?: string | null;
    stockStatus: string;
    stockQty: number;
    reorderLevel?: number;
    featured: boolean;
    isTrending?: boolean;
    categoryId: string;
    imageUrl?: string;
    code?: string | null;
    materialIds?: string[];
  };
  /** Show the single-image field (create mode). On edit, the gallery is a
   *  separate section outside this form, so set this false to avoid it. */
  showImageField?: boolean;
  submitLabel?: string;
}) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [price, setPrice] = useState(defaultValues?.price?.toString() ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(defaultValues?.compareAtPrice?.toString() ?? "");
  const [stockQty, setStockQty] = useState(String(defaultValues?.stockQty ?? 0));
  const [reorderLevel, setReorderLevel] = useState(String(defaultValues?.reorderLevel ?? 5));
  const [madeToOrder, setMadeToOrder] = useState(defaultValues?.stockStatus === "MADE_TO_ORDER");
  const invalidToastShown = useRef(false);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state]);

  const priceNum = Number(price);
  const compareAtPriceNum = Number(compareAtPrice);
  const percentOff = discountPercent(price, compareAtPrice);
  const hasDiscount = percentOff !== null;
  const discountAmount = hasDiscount ? compareAtPriceNum - priceNum : 0;

  const stockQtyNum = Number(stockQty);
  const reorderLevelNum = Number(reorderLevel);
  // Mirrors deriveStockStatus() in src/lib/actions/products.ts — this is
  // exactly what gets saved, not just a hint, so the preview can't drift
  // from the real status the way the old free-choice dropdown could.
  const autoStatus =
    Number.isFinite(stockQtyNum) && Number.isFinite(reorderLevelNum)
      ? stockQtyNum <= 0
        ? "Out of Stock"
        : stockQtyNum <= reorderLevelNum
          ? "Low Stock"
          : "In Stock"
      : null;

  return (
    <form
      action={formAction}
      className="max-w-3xl space-y-5"
      onInvalidCapture={(e) => {
        if (invalidToastShown.current) return;
        invalidToastShown.current = true;
        const target = e.target as HTMLInputElement;
        const label = target.labels?.[0]?.textContent?.replace(/\s*\*\s*$/, "").trim() || target.name;
        toast.error(`${label} is required — please fill it in.`);
        setTimeout(() => {
          invalidToastShown.current = false;
        }, 0);
      }}
    >
      <Card title="Details">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input id="name" name="name" defaultValue={defaultValues?.name} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="code">Product code</Label>
            <Input id="code" name="code" defaultValue={defaultValues?.code ?? ""} placeholder="Leave blank to auto-generate" />
            <p className="text-xs text-neutral-500">
              Auto-generated from the pattern in Settings if left blank — type your own to override it.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={defaultValues?.description}
              required
              className="flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            />
          </div>
        </div>
      </Card>

      <Card title="Pricing">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="price">
              Price (BDT) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="compareAtPrice">Compare-at price (optional)</Label>
            <Input
              id="compareAtPrice"
              name="compareAtPrice"
              type="number"
              step="0.01"
              min="0"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
            />
            <p className="text-xs text-neutral-500">Shown struck-through to signal a discount.</p>
          </div>
        </div>
        {hasDiscount && (
          <div className="mt-4 flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2">
            <StatusPill tone="green">{percentOff}% off</StatusPill>
            <p className="text-sm text-emerald-800">
              Customers save {formatPrice(discountAmount)} off the {formatPrice(compareAtPriceNum)}{" "}
              compare-at price.
            </p>
          </div>
        )}
        {compareAtPrice.trim() !== "" && !hasDiscount && (
          <p className="mt-3 text-xs text-amber-600">
            Compare-at price must be higher than the price for a discount to show.
          </p>
        )}
      </Card>

      <Card title="Classification & stock">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="categoryId">
              Category <span className="text-red-500">*</span>
            </Label>
            <Combobox
              id="categoryId"
              name="categoryId"
              defaultValue={defaultValues?.categoryId ?? ""}
              required
              placeholder="Select category"
              searchPlaceholder="Search categories..."
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="materialId">
              Primary material <span className="text-red-500">*</span>
            </Label>
            <Combobox
              id="materialId"
              name="materialId"
              defaultValue={defaultValues?.materialId ?? ""}
              required
              placeholder="Select material"
              searchPlaceholder="Search materials..."
              options={materials.map((m) => ({ value: m.id, label: m.name }))}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Additional materials</Label>
            <p className="text-xs text-neutral-500">
              For a product made of more than one material (e.g. a steel-body chair with a leather
              seat) — shown alongside the primary material.
            </p>
            <MultiCombobox
              name="materialIds"
              defaultValues={defaultValues?.materialIds ?? []}
              placeholder="Select additional materials"
              searchPlaceholder="Search materials..."
              options={materials.map((m) => ({ value: m.id, label: m.name }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="room">
              Setting <span className="text-red-500">*</span>
            </Label>
            <select id="room" name="room" defaultValue={defaultValues?.room} required className={selectClass}>
              {rooms.map((r) => (
                <option key={r} value={r}>
                  {r.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="madeToOrder"
              checked={madeToOrder}
              onChange={(e) => setMadeToOrder(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300"
            />
            <span className="text-sm text-neutral-700">Made to order (not tracked by quantity)</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="stockQty">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stockQty"
                name="stockQty"
                type="number"
                min="0"
                value={stockQty}
                onChange={(e) => setStockQty(e.target.value)}
                disabled={madeToOrder}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reorderLevel">Reorder level</Label>
              <Input
                id="reorderLevel"
                name="reorderLevel"
                type="number"
                min="0"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(e.target.value)}
                disabled={madeToOrder}
                required
              />
              <p className="text-xs text-neutral-500">Quantity at or below which stock is considered low.</p>
            </div>
          </div>
          <p className="text-xs text-neutral-500">
            Stock status: <span className="font-medium text-neutral-700">{madeToOrder ? "Made to order" : autoStatus}</span> —
            set automatically from quantity vs. reorder level, unless made to order.
          </p>
        </div>
      </Card>

      <Card title="Specifications (shown on the product page)">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="color">Color</Label>
            <Input id="color" name="color" placeholder="e.g. Walnut Brown" defaultValue={defaultValues?.color ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input
              id="dimensions"
              name="dimensions"
              placeholder='e.g. 84 x 36 x 32 in'
              defaultValue={defaultValues?.dimensions ?? ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="deliveryEstimate">Delivery estimate</Label>
            <Input
              id="deliveryEstimate"
              name="deliveryEstimate"
              placeholder="e.g. 7-10 working days"
              defaultValue={defaultValues?.deliveryEstimate ?? ""}
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-neutral-500">Optional — leave blank to hide from the product page.</p>
      </Card>

      {showImageField && (
        <Card title="Media">
          <ImageField defaultValue={defaultValues?.imageUrl} />
        </Card>
      )}

      <Card title="Visibility">
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              defaultChecked={defaultValues?.featured}
              className="h-4 w-4 rounded border-neutral-300"
            />
            <span className="text-sm text-neutral-700">Feature on the homepage</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              id="isTrending"
              name="isTrending"
              type="checkbox"
              defaultChecked={defaultValues?.isTrending}
              className="h-4 w-4 rounded border-neutral-300"
            />
            <span className="text-sm text-neutral-700">Show in the Trending section</span>
          </label>
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/admin/products">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : (submitLabel ?? (defaultValues ? "Save changes" : "Create product"))}
        </Button>
      </div>
    </form>
  );
}
