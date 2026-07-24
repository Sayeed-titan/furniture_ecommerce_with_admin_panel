"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/use-translation";

/**
 * Translated section heading with an optional "View all" link on the right.
 * Kept as a small client leaf so the surrounding section can stay a Server
 * Component that renders Prisma data (product/category cards).
 */
export function CommerceSectionHeading({
  titleKey,
  subtitleKey,
  viewAllHref,
}: {
  titleKey: string;
  subtitleKey: string;
  viewAllHref?: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          {t(titleKey)}
        </h2>
        <p className="mt-1.5 text-neutral-600">{t(subtitleKey)}</p>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="hidden shrink-0 text-sm font-semibold text-[#c2570f] hover:text-[#a8480f] sm:block"
        >
          {t("commerce.viewAll")} &rarr;
        </Link>
      )}
    </div>
  );
}
