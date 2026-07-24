"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/use-translation";

type Category = { slug: string; name: string };

const materialValues = ["SOLID_WOOD", "ENGINEERED_WOOD", "ARTIFICIAL_WOOD", "LEATHER", "FABRIC", "METAL"];
const roomValues = ["OFFICE", "WORKSPACE", "CONFERENCE", "RECEPTION", "HEALTHCARE", "INDUSTRIAL"];
const stockValues = ["IN_STOCK", "LOW_STOCK", "MADE_TO_ORDER"];

export function ProductFilters({
  categories,
  activeParams,
}: {
  categories: Category[];
  activeParams: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

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
      <FilterGroup title={t("productsPage.filters.category")}>
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

      <FilterGroup title={t("productsPage.filters.material")}>
        {materialValues.map((value) => (
          <FilterButton
            key={value}
            active={activeParams.material === value}
            onClick={() => setParam("material", value)}
          >
            {t(`materials.${value}`)}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup title={t("productsPage.filters.room")}>
        {roomValues.map((value) => (
          <FilterButton
            key={value}
            active={activeParams.room === value}
            onClick={() => setParam("room", value)}
          >
            {t(`rooms.${value}`)}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup title={t("productsPage.filters.availability")}>
        {stockValues.map((value) => (
          <FilterButton
            key={value}
            active={activeParams.stock === value}
            onClick={() => setParam("stock", value)}
          >
            {t(`stock.${value}`)}
          </FilterButton>
        ))}
      </FilterGroup>

      {(activeParams.category || activeParams.material || activeParams.room || activeParams.stock) && (
        <button
          onClick={() => router.push("/products")}
          className="text-sm font-medium text-neutral-500 underline underline-offset-4 hover:text-neutral-900"
        >
          {t("productsPage.filters.clearAll")}
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
