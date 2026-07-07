"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/use-translation";

/**
 * The translatable headline/subtitle/CTAs only — no product data, so this
 * can be a Client Component while PremiumHero itself stays server-rendered
 * (it renders the hero image + product link, which carry a Prisma Decimal
 * price field that can't cross the client boundary).
 */
export function HeroCopy() {
  const { t } = useTranslation();

  return (
    <div className="max-w-xl">
      <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
        {t("hero.headline")}
      </h1>
      <p className="mt-4 max-w-md text-base text-white/80 sm:text-lg">{t("hero.subtitle")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/products">{t("hero.ctaPrimary")}</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-white/60 bg-white/5 text-white backdrop-blur-sm hover:bg-white hover:text-neutral-900"
        >
          <Link href="/contact">{t("hero.ctaSecondary")}</Link>
        </Button>
      </div>
    </div>
  );
}

export function FeaturedLabel() {
  const { t } = useTranslation();
  return (
    <span className="block text-xs uppercase tracking-wide text-white/60">
      {t("hero.featuredLabel")}
    </span>
  );
}
