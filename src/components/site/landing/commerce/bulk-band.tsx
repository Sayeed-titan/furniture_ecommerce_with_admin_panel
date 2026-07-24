"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";

/** Closing call-to-action: the B2B bulk-quote band. */
export function CommerceBulkBand() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#12181d]">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t("commerce.bulkTitle")}
          </h2>
          <p className="mt-3 text-neutral-300">{t("commerce.bulkSubtitle")}</p>
        </div>
        <Link
          href="/contact"
          className="group inline-flex shrink-0 items-center gap-2 rounded-md bg-[#e8873a] px-7 py-3.5 text-sm font-semibold text-[#1a1205] transition-colors hover:bg-[#f0a05c]"
        >
          {t("commerce.bulkCta")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
