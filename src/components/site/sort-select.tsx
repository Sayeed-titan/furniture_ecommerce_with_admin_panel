"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/use-translation";

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const options = [
    { value: "", label: t("productsPage.sort.newest") },
    { value: "price_asc", label: t("productsPage.sort.priceAsc") },
    { value: "price_desc", label: t("productsPage.sort.priceDesc") },
  ];

  function onChange(value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) {
      next.set("sort", value);
    } else {
      next.delete("sort");
    }
    router.push(`/products?${next.toString()}`);
  }

  return (
    <select
      aria-label="Sort products"
      value={searchParams.get("sort") ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
