"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/use-translation";

export function PremiumCta() {
  const { t } = useTranslation();

  return (
    <section className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          {t("cta.heading")}
        </h2>
        <p className="mt-3 text-neutral-600">{t("cta.subtitle")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/wishlist">{t("cta.primary")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/products">{t("cta.secondary")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
