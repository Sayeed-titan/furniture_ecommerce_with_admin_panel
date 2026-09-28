"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from "cmdk";
import { cn } from "@/lib/utils";

export type ComboboxOption = { value: string; label: string };

/** A searchable single-select dropdown. Two modes:
 *  - Form mode (pass `name`): renders a hidden input carrying the chosen
 *    value, a drop-in replacement for a native <select> inside a plain
 *    <form action={...}> — no server-action changes needed.
 *  - Controlled mode (pass `value` + `onValueChange`): behaves like a
 *    controlled input for callers that react to the change directly (e.g.
 *    a URL-param filter), same as FilterSelect used a plain <select>. */
export function Combobox({
  id,
  name,
  options,
  defaultValue,
  value: controlledValue,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results.",
  required,
}: {
  id?: string;
  name?: string;
  options: ComboboxOption[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const selected = options.find((o) => o.value === value);

  function selectValue(v: string) {
    if (!isControlled) setInternalValue(v);
    onValueChange?.(v);
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      {name && <input type="hidden" name={name} value={value} required={required} readOnly />}
      <Popover.Trigger asChild>
        <button
          id={id}
          type="button"
          className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <span className={cn("truncate", !selected && "text-neutral-400")}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-neutral-400" />
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
                  onSelect={() => selectValue(option.value)}
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm data-[selected=true]:bg-neutral-100"
                >
                  <Check className={cn("h-4 w-4 shrink-0", value === option.value ? "opacity-100" : "opacity-0")} />
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
