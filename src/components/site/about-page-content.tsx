"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/use-translation";
import { Button } from "@/components/ui/button";

export function AboutPageContent() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
        {t("aboutPage.eyebrow")}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("aboutPage.heading")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-700">
        {t("aboutPage.lead")}
      </p>

      <h2 className="mt-14 text-xl font-semibold tracking-tight">{t("aboutPage.waysHeading")}</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900">{t("aboutPage.readyMadeTitle")}</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {t("aboutPage.readyMadeBody")}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900">{t("aboutPage.customTitle")}</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {t("aboutPage.customBody")}
          </p>
        </div>
      </div>

      <div className="mt-14 border-t border-neutral-200 pt-10">
        <h2 className="text-xl font-semibold tracking-tight">{t("aboutPage.whyTitle")}</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-neutral-700">{t("aboutPage.whyBody")}</p>
      </div>

      <div className="mt-14 rounded-xl bg-neutral-50 p-8 text-center">
        <h2 className="text-lg font-semibold tracking-tight">{t("aboutPage.ctaTitle")}</h2>
        <p className="mt-2 text-sm text-neutral-600">{t("aboutPage.ctaBody")}</p>
        <Button asChild className="mt-5">
          <Link href="/contact">{t("aboutPage.ctaButton")}</Link>
        </Button>
      </div>
    </div>
  );
}
