import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatOrderStatus } from "@/lib/format";

const STEPS = ["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

/**
 * Visual progress tracker for an order's current status. Purely derived from
 * the single `status` field — there's no per-stage history/timestamp model,
 * so this shows "how far along" rather than "when each stage happened."
 * CANCELLED/REFUNDED aren't part of the linear happy path, so they render as
 * a plain terminal badge instead of a step position.
 */
export function OrderStatusStepper({ status }: { status: string }) {
  if (status === "CANCELLED" || status === "REFUNDED") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        <X className="h-4 w-4" />
        {formatOrderStatus(status)}
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status as (typeof STEPS)[number]);

  return (
    <ol className="flex items-start">
      {STEPS.map((step, i) => {
        const done = currentIndex >= 0 && i < currentIndex;
        const current = i === currentIndex;
        return (
          <li key={step} className="flex flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <div
                className={cn(
                  "h-px flex-1",
                  i === 0 ? "invisible" : done || current ? "bg-neutral-900" : "bg-neutral-200"
                )}
              />
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  done
                    ? "bg-neutral-900 text-white"
                    : current
                      ? "border-2 border-neutral-900 bg-white text-neutral-900"
                      : "border border-neutral-300 bg-white text-neutral-400"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <div
                className={cn(
                  "h-px flex-1",
                  i === STEPS.length - 1 ? "invisible" : done ? "bg-neutral-900" : "bg-neutral-200"
                )}
              />
            </div>
            <span
              className={cn(
                "mt-1.5 text-xs font-medium",
                current ? "text-neutral-900" : done ? "text-neutral-600" : "text-neutral-400"
              )}
            >
              {formatOrderStatus(step)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
