"use client";

import { Truck } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";

export function DeliveryEstimate({ estimate }: { estimate: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-1.5 text-sm text-neutral-600">
      <Truck className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        {t("productDetail.deliveryEstimatePrefix")}: <span className="font-medium text-neutral-900">{estimate}</span>
      </span>
    </div>
  );
}
