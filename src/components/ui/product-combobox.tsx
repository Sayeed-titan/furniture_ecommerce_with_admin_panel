"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from "cmdk";
import { cn } from "@/lib/utils";

export type ProductOption = { value: string; label: string; imageUrl?: string | null; sublabel?: string };

/** Searchable product picker with a thumbnail per row and a larger preview
 *  on hover — similarly-named products (a common furniture-catalog problem)
 *  stay tellable apart by photo, not just name. Form-mode only (renders a
 *  hidden input), used e.g. in the Stock In line items. */
export function ProductCombobox({
  name,
  options,
  defaultValue,
  placeholder = "Select product",
  required,
}: {
  name: string;
  options: ProductOption[];
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "");
  const [hovered, setHovered] = useState<ProductOption | null>(null);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setHovered(null);
      }}
    >
      <input type="hidden" name={name} value={value} required={required} readOnly />
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex h-10 w-full items-center gap-2 rounded-md border border-neutral-300 bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded bg-neutral-100">
            {selected?.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- tiny trigger thumbnail
              <img src={selected.imageUrl} alt="" className="h-full w-full object-cover" />
            )}
          </span>
          <span className={cn("flex-1 truncate text-left", !selected && "text-neutral-400")}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-neutral-400" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={4} className="z-50 flex items-start gap-2">
          <div className="w-64 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg">
            <Command shouldFilter>
              <CommandInput
                placeholder="Search products..."
                className="w-full border-b border-neutral-200 px-3 py-2 text-sm outline-none placeholder:text-neutral-400"
              />
              <CommandList className="max-h-72 overflow-y-auto p-1">
                <CommandEmpty className="px-3 py-2 text-sm text-neutral-500">No results.</CommandEmpty>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onMouseEnter={() => setHovered(option)}
                    onSelect={() => {
                      setValue(option.value);
                      setOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm data-[selected=true]:bg-neutral-100"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-neutral-100">
                      {option.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element -- tiny list thumbnail
                        <img src={option.imageUrl} alt="" className="h-full w-full object-cover" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{option.label}</span>
                      {option.sublabel && (
                        <span className="block truncate text-xs text-neutral-400">{option.sublabel}</span>
                      )}
                    </span>
                    <Check className={cn("h-4 w-4 shrink-0", value === option.value ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </div>
          {hovered?.imageUrl && (
            <div className="h-40 w-40 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-white p-1 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element -- hover preview of an already-loaded thumbnail */}
              <img src={hovered.imageUrl} alt="" className="h-full w-full rounded object-cover" />
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
