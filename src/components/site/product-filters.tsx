"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type Category = { slug: string; name: string };

const materials = [
  { value: "SOLID_WOOD", label: "Solid Wood" },
  { value: "ENGINEERED_WOOD", label: "Engineered Wood" },
  { value: "ARTIFICIAL_WOOD", label: "Artificial Wood" },
  { value: "LEATHER", label: "Leather" },
  { value: "FABRIC", label: "Fabric" },
  { value: "METAL", label: "Metal" },
];

const rooms = [
  { value: "LIVING_ROOM", label: "Living Room" },
  { value: "BEDROOM", label: "Bedroom" },
  { value: "DINING_ROOM", label: "Dining Room" },
  { value: "OFFICE", label: "Office" },
  { value: "OUTDOOR", label: "Outdoor" },
  { value: "KITCHEN", label: "Kitchen" },
];

const stockOptions = [
  { value: "IN_STOCK", label: "In Stock" },
  { value: "LOW_STOCK", label: "Low Stock" },
  { value: "MADE_TO_ORDER", label: "Made to Order" },
];

export function ProductFilters({
  categories,
  activeParams,
}: {
  categories: Category[];
  activeParams: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === null || next.get(key) === value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    router.push(`/products?${next.toString()}`);
  }

  return (
    <aside className="space-y-8">
      <FilterGroup title="Category">
        {categories.map((c) => (
          <FilterButton
            key={c.slug}
            active={activeParams.category === c.slug}
            onClick={() => setParam("category", c.slug)}
          >
            {c.name}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup title="Material">
        {materials.map((m) => (
          <FilterButton
            key={m.value}
            active={activeParams.material === m.value}
            onClick={() => setParam("material", m.value)}
          >
            {m.label}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup title="Room">
        {rooms.map((r) => (
          <FilterButton
            key={r.value}
            active={activeParams.room === r.value}
            onClick={() => setParam("room", r.value)}
          >
            {r.label}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        {stockOptions.map((s) => (
          <FilterButton
            key={s.value}
            active={activeParams.stock === s.value}
            onClick={() => setParam("stock", s.value)}
          >
            {s.label}
          </FilterButton>
        ))}
      </FilterGroup>

      {(activeParams.category || activeParams.material || activeParams.room || activeParams.stock) && (
        <button
          onClick={() => router.push("/products")}
          className="text-sm font-medium text-neutral-500 underline underline-offset-4 hover:text-neutral-900"
        >
          Clear all filters
        </button>
      )}
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-neutral-900">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
      )}
    >
      {children}
    </button>
  );
}
