"use client";

import { Smartphone, Banknote } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";

export function PaymentMethodsStrip() {
  const { t } = useTranslation();

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-400">
        {t("productDetail.paymentHeading")}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700">
          <Banknote className="h-3.5 w-3.5" aria-hidden="true" />
          {t("productDetail.paymentCod")}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700">
          <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
          {t("productDetail.paymentOnline")}
        </span>
      </div>
    </div>
  );
}
