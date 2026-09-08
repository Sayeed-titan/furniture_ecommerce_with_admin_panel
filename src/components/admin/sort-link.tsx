"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

/** A clickable column header that writes/toggles `sort`/`dir` URL params, preserving other filters. */
export function SortLink({
  field,
  label,
  activeField,
  activeDir,
}: {
  field: string;
  label: string;
  activeField: string;
  activeDir: "asc" | "desc";
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isActive = field === activeField;
  const nextDir = isActive && activeDir === "asc" ? "desc" : "asc";

  const params = new URLSearchParams(searchParams.toString());
  params.set("sort", field);
  params.set("dir", nextDir);

  const Icon = !isActive ? ArrowUpDown : activeDir === "asc" ? ArrowUp : ArrowDown;

  return (
    <Link
      href={`${pathname}?${params.toString()}`}
      className="inline-flex items-center gap-1 hover:text-neutral-900"
    >
      {label}
      <Icon className={isActive ? "h-3.5 w-3.5 text-neutral-700" : "h-3.5 w-3.5 text-neutral-300"} />
    </Link>
  );
}
