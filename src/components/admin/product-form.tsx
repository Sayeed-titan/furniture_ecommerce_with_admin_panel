import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/image-field";

type Category = { id: string; name: string };

const materials = ["SOLID_WOOD", "ENGINEERED_WOOD", "ARTIFICIAL_WOOD", "LEATHER", "FABRIC", "METAL"];
const rooms = ["LIVING_ROOM", "BEDROOM", "DINING_ROOM", "OFFICE", "OUTDOOR", "KITCHEN"];
const stockStatuses = ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK", "MADE_TO_ORDER"];

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
  action,
  defaultValues,
  showImageField = true,
  submitLabel,
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
  /** Show the single-image field (create mode). On edit, the gallery is a
   *  separate section outside this form, so set this false to avoid it. */
  showImageField?: boolean;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="max-w-3xl space-y-5">
      <Card title="Details">
        <div className="space-y-4">
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
        </div>
      </Card>

      <Card title="Pricing">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="price">Price (USD)</Label>
            <Input id="price" name="price" type="number" step="0.01" min="0" defaultValue={defaultValues?.price} required />
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
            <p className="text-xs text-neutral-500">Shown struck-through to signal a discount.</p>
          </div>
        </div>
      </Card>

      <Card title="Classification & stock">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="categoryId">Category</Label>
            <select id="categoryId" name="categoryId" defaultValue={defaultValues?.categoryId ?? ""} required className={selectClass}>
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
            <select id="material" name="material" defaultValue={defaultValues?.material} required className={selectClass}>
              {materials.map((m) => (
                <option key={m} value={m}>
                  {m.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="room">Room</Label>
            <select id="room" name="room" defaultValue={defaultValues?.room} required className={selectClass}>
              {rooms.map((r) => (
                <option key={r} value={r}>
                  {r.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="stockStatus">Stock status</Label>
              <select id="stockStatus" name="stockStatus" defaultValue={defaultValues?.stockStatus} required className={selectClass}>
                {stockStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stockQty">Quantity</Label>
              <Input id="stockQty" name="stockQty" type="number" min="0" defaultValue={defaultValues?.stockQty ?? 0} required />
            </div>
          </div>
        </div>
      </Card>

      {showImageField && (
        <Card title="Media">
          <ImageField defaultValue={defaultValues?.imageUrl} />
        </Card>
      )}

      <Card title="Visibility">
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
      </Card>

      <div className="flex justify-end">
        <Button type="submit">{submitLabel ?? (defaultValues ? "Save changes" : "Create product")}</Button>
      </div>
    </form>
  );
}
