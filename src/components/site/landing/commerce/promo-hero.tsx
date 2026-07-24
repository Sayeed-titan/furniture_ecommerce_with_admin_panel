"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";

/**
 * Merchandising banner: a wide workplace photo with a left-aligned overlay
 * card. Static image (not a product) so it reads as a storefront hero.
 */
export function CommercePromoHero() {
  const { t } = useTranslation();

  return (
    <section className="relative isolate overflow-hidden bg-[#0f1418]">
      <Image
        src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1418] via-[#0f1418]/85 to-[#0f1418]/20" />

      <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:min-h-[600px] lg:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e8873a]">
            {t("commerce.heroEyebrow")}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("commerce.heroTitle")}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-300 sm:text-lg">
            {t("commerce.heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-md bg-[#e8873a] px-6 py-3 text-sm font-semibold text-[#1a1205] transition-colors hover:bg-[#f0a05c]"
            >
              {t("commerce.heroCtaPrimary")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5"
            >
              {t("commerce.heroCtaSecondary")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
