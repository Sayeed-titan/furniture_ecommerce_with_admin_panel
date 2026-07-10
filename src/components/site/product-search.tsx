"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/use-translation";

/** Debounced text search that syncs the `q` query param on /products. */
export function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const urlQ = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlQ);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the box in sync if the URL changes elsewhere (e.g. clear filters),
  // using the render-time "adjust state" pattern instead of an effect.
  const [prevUrlQ, setPrevUrlQ] = useState(urlQ);
  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ);
    setValue(urlQ);
  }

  function commit(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.trim()) {
      params.set("q", next.trim());
    } else {
      params.delete("q");
    }
    router.push(`/products?${params.toString()}`);
  }

  function onChange(next: string) {
    setValue(next);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => commit(next), 350);
  }

  return (
    <div className="relative">
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
      >
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
        <path d="m14 14 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (debounce.current) clearTimeout(debounce.current);
            commit(value);
          }
        }}
        aria-label={t("productsPage.search.label")}
        placeholder={t("productsPage.search.placeholder")}
        className="w-full rounded-full border border-neutral-300 bg-white py-2.5 pl-9 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
      />
    </div>
  );
}
