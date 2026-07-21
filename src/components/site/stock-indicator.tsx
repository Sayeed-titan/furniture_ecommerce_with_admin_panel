"use client";

import { CheckCircle2, AlertTriangle, XCircle, Hammer } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

const STYLES: Record<string, { icon: typeof CheckCircle2; className: string }> = {
  IN_STOCK: { icon: CheckCircle2, className: "text-emerald-700" },
  LOW_STOCK: { icon: AlertTriangle, className: "text-amber-700" },
  OUT_OF_STOCK: { icon: XCircle, className: "text-red-700" },
  MADE_TO_ORDER: { icon: Hammer, className: "text-neutral-700" },
};

export function StockIndicator({ status }: { status: string }) {
  const { t } = useTranslation();
  const style = STYLES[status] ?? STYLES.IN_STOCK;
  const Icon = style.icon;

  return (
    <div className={cn("flex items-center gap-1.5 text-sm font-semibold", style.className)}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      {t(`stock.${status}`)}
    </div>
  );
}
