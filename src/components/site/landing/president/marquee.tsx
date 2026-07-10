"use client";

import { useTranslation, useDisplayFontClassName } from "@/lib/i18n/use-translation";

/**
 * Slow editorial marquee dividing the hero from the manifesto — alternating
 * solid-cream and hollow (stroked) serif words gliding on a brass hairline.
 */
export function PresidentMarquee() {
  const { t } = useTranslation();
  const displayFont = useDisplayFontClassName();

  const words = [
    t("president.marquee1"),
    t("president.marquee2"),
    t("president.marquee3"),
    t("president.marquee4"),
  ];

  const strip = (hidden: boolean) => (
    <span
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {words.map((w, i) => (
        <span key={i} className="flex items-center">
          <span
            className={
              i % 2 === 0
                ? "text-[#f4efe6]"
                : "text-transparent [-webkit-text-stroke:1px_rgba(217,183,121,0.8)]"
            }
          >
            {w}
          </span>
          <span aria-hidden="true" className="mx-8 inline-block h-2 w-2 rotate-45 bg-[#b8925a]/80 sm:mx-12" />
        </span>
      ))}
    </span>
  );

  return (
    <div className="relative overflow-hidden border-y border-[#b8925a]/20 bg-[#14100c] py-6 sm:py-8">
      <div
        className={`${displayFont} pres-anim flex w-max items-center whitespace-nowrap text-4xl font-medium italic [animation:pres-marquee_36s_linear_infinite] sm:text-6xl`}
      >
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );
}
