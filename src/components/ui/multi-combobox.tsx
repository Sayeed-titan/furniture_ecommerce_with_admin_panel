"use client";

import { useState } from "react";
import { Check, X, ChevronsUpDown } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from "cmdk";
import { cn } from "@/lib/utils";
import type { ComboboxOption } from "@/components/ui/combobox";

/** Searchable multi-select — tag chips + a checklist-style popover, so a
 *  list that might grow to 20+ options (e.g. materials) doesn't turn into
 *  an unwieldy wall of checkboxes. Form-mode: renders one hidden input per
 *  selected value, same `name` for all — reads back with
 *  `formData.getAll(name)`, a drop-in replacement for a checkbox group. */
export function MultiCombobox({
  name,
  options,
  defaultValues = [],
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results.",
}: {
  name: string;
  options: ComboboxOption[];
  defaultValues?: string[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<string[]>(defaultValues);

  function toggle(v: string) {
    setValues((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));
  }

  const selectedOptions = options.filter((o) => values.includes(o.value));

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      {values.map((v) => (
        <input key={v} type="hidden" name={name} value={v} readOnly />
      ))}
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          {selectedOptions.length === 0 ? (
            <span className="text-neutral-400">{placeholder}</span>
          ) : (
            selectedOptions.map((o) => (
              <span
                key={o.value}
                className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700"
              >
                {o.label}
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(o.value);
                  }}
                  className="cursor-pointer text-neutral-400 hover:text-neutral-700"
                  aria-label={`Remove ${o.label}`}
                >
                  <X className="h-3 w-3" />
                </span>
              </span>
            ))
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 text-neutral-400" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 min-w-[220px] max-w-sm overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg"
        >
          <Command shouldFilter>
            <CommandInput
              placeholder={searchPlaceholder}
              className="w-full border-b border-neutral-200 px-3 py-2 text-sm outline-none placeholder:text-neutral-400"
            />
            <CommandList className="max-h-60 overflow-y-auto p-1">
              <CommandEmpty className="px-3 py-2 text-sm text-neutral-500">{emptyText}</CommandEmpty>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => toggle(option.value)}
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm data-[selected=true]:bg-neutral-100"
                >
                  <Check className={cn("h-4 w-4 shrink-0", values.includes(option.value) ? "opacity-100" : "opacity-0")} />
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
