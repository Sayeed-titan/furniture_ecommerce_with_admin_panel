import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageField } from "@/components/admin/image-field";

type Category = { id: string; name: string };

const materials = [
  "SOLID_WOOD",
  "ENGINEERED_WOOD",
  "ARTIFICIAL_WOOD",
  "LEATHER",
  "FABRIC",
  "METAL",
];

const rooms = ["LIVING_ROOM", "BEDROOM", "DINING_ROOM", "OFFICE", "OUTDOOR", "KITCHEN"];

const stockStatuses = ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK", "MADE_TO_ORDER"];

export function ProductForm({
  categories,
  action,
  defaultValues,
}: {
  categories: Category[];
  action: (formData: FormData) => void;
  defaultValues?: {
    name: string;
    description: string;
    price: number | string;
    compareAtPrice?: number | string | null;
    material: string;
    room: string;
    stockStatus: string;
    stockQty: number;
    featured: boolean;
    categoryId: string;
    imageUrl?: string;
  };
}) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={defaultValues?.name} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description}
          required
          className="flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues?.price}
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
            defaultValue={defaultValues?.compareAtPrice ?? ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={defaultValues?.categoryId}
            required
            className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="material">Material</Label>
          <select
            id="material"
            name="material"
            defaultValue={defaultValues?.material}
            required
            className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            {materials.map((m) => (
              <option key={m} value={m}>
                {m.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="room">Room</Label>
          <select
            id="room"
            name="room"
            defaultValue={defaultValues?.room}
            required
            className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            {rooms.map((r) => (
              <option key={r} value={r}>
                {r.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="stockStatus">Stock status</Label>
          <select
            id="stockStatus"
            name="stockStatus"
            defaultValue={defaultValues?.stockStatus}
            required
            className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            {stockStatuses.map((s) => (
              <option key={s} value={s}>
                {s.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="stockQty">Stock quantity</Label>
          <Input
            id="stockQty"
            name="stockQty"
            type="number"
            min="0"
            defaultValue={defaultValues?.stockQty ?? 0}
            required
          />
        </div>
      </div>

      <ImageField defaultValue={defaultValues?.imageUrl} />

      <div className="flex items-center gap-2">
        <input
          id="featured"
          name="featured"
          type="checkbox"
          defaultChecked={defaultValues?.featured}
          className="h-4 w-4 rounded border-neutral-300"
        />
        <Label htmlFor="featured">Feature on homepage</Label>
      </div>

      <Button type="submit">{defaultValues ? "Save changes" : "Create product"}</Button>
    </form>
  );
}
