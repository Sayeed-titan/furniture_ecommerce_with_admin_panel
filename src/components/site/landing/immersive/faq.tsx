"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/reveal";
import { useTranslation, useDisplayFontClassName } from "@/lib/i18n/use-translation";

export function Faq() {
  const { t } = useTranslation();
  const displayFont = useDisplayFontClassName();
  const [open, setOpen] = useState<number | null>(0);

  const FAQS = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Reveal>
        <h2 className={cn(displayFont, "text-3xl tracking-tight text-neutral-900 sm:text-4xl")}>
          {t("faq.heading")}
        </h2>
      </Reveal>

      <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              >
                <span className="font-medium text-neutral-900">{item.q}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid overflow-hidden transition-all duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <p className="min-h-0 text-neutral-600">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
