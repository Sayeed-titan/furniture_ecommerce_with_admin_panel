"use client";

import { useTranslation } from "@/lib/i18n/use-translation";

export function ProductInterestHeading() {
  const { t } = useTranslation();
  return <h2 className="font-semibold text-neutral-900">{t("productDetail.interested")}</h2>;
}

export function ProductInterestSubtitle() {
  const { t } = useTranslation();
  return <p className="mt-1 text-sm text-neutral-600">{t("productDetail.shareDetails")}</p>;
}
