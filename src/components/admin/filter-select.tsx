"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Combobox } from "@/components/ui/combobox";

/** A searchable dropdown that writes/removes a URL param so a server list
 *  page can filter — same URL-param behavior as before, now searchable so
 *  a long, growing list (e.g. 100+ categories) stays usable. */
export function FilterSelect({
  param,
  placeholder,
  options,
}: {
  param: string;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(param, value);
    else params.delete(param);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="w-48">
      <Combobox
        value={searchParams.get(param) ?? ""}
        onValueChange={onChange}
        placeholder={placeholder}
        searchPlaceholder={`Search ${placeholder.replace(/^All /i, "").toLowerCase()}...`}
        options={[{ value: "", label: placeholder }, ...options]}
      />
    </div>
  );
}
