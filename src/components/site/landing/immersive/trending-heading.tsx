"use client";

import { useTranslation, useDisplayFontClassName } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

/**
 * Split out from TrendingCarousel (which must stay a Server Component —
 * see carousel-scroller.tsx for why) so the heading can use the
 * translation hook without pulling product data across the client boundary.
 */
export function TrendingHeading() {
  const { t } = useTranslation();
  const displayFont = useDisplayFontClassName();

  return (
    <div className="mb-8">
      <h2 className={cn(displayFont, "text-3xl tracking-tight text-neutral-900 sm:text-4xl")}>
        {t("trending.heading")}
      </h2>
      <p className="mt-2 text-neutral-600">{t("trending.subtitle")}</p>
    </div>
  );
}
