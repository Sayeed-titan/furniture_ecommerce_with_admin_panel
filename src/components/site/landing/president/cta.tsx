"use client";

import Link from "next/link";
import { useTranslation, useDisplayFontClassName } from "@/lib/i18n/use-translation";
import { ThroneMark } from "@/components/site/brand/logo";

/** The finale — a seal-stamped invitation on deep espresso. */
export function PresidentCta() {
  const { t } = useTranslation();
  const displayFont = useDisplayFontClassName();

  return (
    <section className="relative overflow-hidden bg-[#100d0a] px-4 py-28 text-center text-[#f4efe6] sm:px-6 sm:py-40 lg:px-8">
      {/* Giant watermark throne */}
      <ThroneMark
        strokeWidth={1}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 text-[#b8925a]/[0.07]"
      />

      <div className="relative mx-auto max-w-3xl">
        <span className="mx-auto mb-10 flex h-16 w-16 items-center justify-center rounded-full border border-[#b8925a]/40 text-[#d9b779]">
          <ThroneMark className="h-9 w-9" strokeWidth={3} />
        </span>
        <h2 className={`${displayFont} text-4xl font-medium leading-tight sm:text-6xl`}>
          {t("president.ctaTitle")} <em className="text-[#d9b779]">{t("president.ctaTitleEm")}</em>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#f4efe6]/60">
          {t("president.ctaSub")}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 rounded-full bg-[#d9b779] px-7 py-3.5 text-sm font-semibold tracking-wide text-[#171310] transition-all duration-300 hover:bg-[#f4efe6] hover:shadow-[0_0_40px_rgba(217,183,121,0.35)]"
          >
            {t("president.ctaExplore")}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 rounded-full border border-[#f4efe6]/25 px-7 py-3.5 text-sm font-medium tracking-wide text-[#f4efe6] transition-colors duration-300 hover:border-[#d9b779] hover:text-[#d9b779]"
          >
            {t("president.ctaCustom")}
          </Link>
        </div>
      </div>
    </section>
  );
}
