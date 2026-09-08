"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

/** A pair of date inputs that write/remove `from`/`to` URL params so a server list page can filter by date range. */
export function DateRangeFilter({
  fromParam = "from",
  toParam = "to",
}: {
  fromParam?: string;
  toParam?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(param: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(param, value);
    else params.delete(param);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  const inputClass =
    "h-10 rounded-md border border-neutral-300 bg-white px-2 text-sm text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900";

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="date"
        aria-label="From date"
        value={searchParams.get(fromParam) ?? ""}
        onChange={(e) => update(fromParam, e.target.value)}
        className={inputClass}
      />
      <span className="text-sm text-neutral-400">–</span>
      <input
        type="date"
        aria-label="To date"
        value={searchParams.get(toParam) ?? ""}
        onChange={(e) => update(toParam, e.target.value)}
        className={inputClass}
      />
    </div>
  );
}
