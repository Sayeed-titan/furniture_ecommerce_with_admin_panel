"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/use-translation";

export function CategoryShowcaseHeading() {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        {t("categoryShowcase.heading")}
      </h2>
      <p className="mt-1 text-neutral-600">{t("categoryShowcase.subtitle")}</p>
    </div>
  );
}

export function ViewAllLink() {
  const { t } = useTranslation();
  return (
    <Link
      href="/products"
      className="hidden text-sm font-medium text-neutral-600 hover:text-neutral-900 sm:block"
    >
      {t("categoryShowcase.viewAll")} &rarr;
    </Link>
  );
}

/** Takes only the plain count (a number, safe to cross the client boundary),
 * never the category's nested product objects. */
export function ItemCountLabel({ count }: { count: number }) {
  const { t } = useTranslation();
  return (
    <>
      {count} {count === 1 ? t("categoryShowcase.itemsSingular") : t("categoryShowcase.itemsPlural")}
    </>
  );
}
