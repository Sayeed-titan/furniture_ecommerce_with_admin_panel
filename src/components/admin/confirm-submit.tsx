"use client";

import { cn } from "@/lib/utils";

/**
 * A submit button that asks for confirmation before submitting its
 * surrounding <form>. Use for destructive actions (delete). Keeps the
 * server-action form pattern — just guards the click.
 */
export function ConfirmSubmit({
  message,
  children,
  className,
  variant = "ghost",
}: {
  message: string;
  children: React.ReactNode;
  className?: string;
  variant?: "ghost" | "danger";
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        variant === "danger"
          ? "text-red-600 hover:bg-red-50"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
        className
      )}
    >
      {children}
    </button>
  );
}
