"use client";

import { useTranslation, useDisplayFontClassName } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

export function MaterialShowcaseHeading() {
  const { t } = useTranslation();
  const displayFont = useDisplayFontClassName();

  return (
    <>
      <h2 className={cn(displayFont, "text-3xl tracking-tight text-neutral-900 sm:text-4xl")}>
        {t("materialShowcase.heading")}
      </h2>
      <p className="mt-2 text-neutral-600">{t("materialShowcase.subtitle")}</p>
    </>
  );
}
