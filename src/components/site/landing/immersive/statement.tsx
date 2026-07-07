"use client";

import { Reveal } from "@/components/site/reveal";
import { useTranslation, useDisplayFontClassName } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

export function Statement() {
  const { t } = useTranslation();
  const displayFont = useDisplayFontClassName();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <Reveal>
          <p
            className={cn(
              displayFont,
              "text-3xl leading-snug tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl"
            )}
          >
            {t("statement.line1")}
            <span className="italic text-neutral-500">{t("statement.line2")}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
