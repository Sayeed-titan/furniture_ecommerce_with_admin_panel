"use client";

import { useRef, useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";

/**
 * A submit button that asks for confirmation — via a real dialog, not
 * window.confirm() — before submitting its surrounding <form>. Use for
 * destructive actions (delete). Keeps the server-action form pattern: the
 * dialog's confirm button lives in a portal outside the form's DOM subtree,
 * so it submits the form via a stable ref + requestSubmit() rather than
 * relying on native form-nesting.
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
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
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
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <AlertDialog.Title className="text-base font-semibold text-neutral-900">
            Are you sure?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-relaxed text-neutral-600">
            {message}
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
              >
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={() => triggerRef.current?.closest("form")?.requestSubmit()}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors",
                  variant === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-neutral-900 hover:bg-neutral-800"
                )}
              >
                Confirm
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
