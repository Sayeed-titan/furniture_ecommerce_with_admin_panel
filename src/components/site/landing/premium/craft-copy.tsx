"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";

/**
 * All the translatable text for CraftSection, no product data — kept
 * separate so CraftSection itself can stay server-rendered (it renders a
 * Prisma-sourced product image, which carries a Decimal field).
 */
export function CraftCopy() {
  const { t } = useTranslation();
  const points = [t("craft.point1"), t("craft.point2"), t("craft.point3")];

  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        {t("craft.eyebrow")}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        {t("craft.heading")}
      </h2>
      <p className="mt-4 text-neutral-600">{t("craft.body")}</p>
      <ul className="mt-6 space-y-3">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-neutral-700">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Check className="h-3 w-3" />
            </span>
            {point}
          </li>
        ))}
      </ul>
      <Link
        href="/contact"
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
      >
        {t("craft.cta")} <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
