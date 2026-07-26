"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useWorkshopDisplayFont } from "./chrome";

/**
 * Translated hero copy — kicker, the masked three-line serif headline,
 * subtitle and CTAs. Kept as a Client Component so WorkshopHero itself can
 * stay a Server Component and render the featured product plate (Prisma
 * Decimal price) without crossing the boundary.
 */
export function WorkshopHeroCopy() {
  const { t } = useTranslation();
  const font = useWorkshopDisplayFont();

  const lines = [
    { text: t("workshop.heroTitle1"), em: false, delay: 0.15 },
    { text: t("workshop.heroTitle2"), em: false, delay: 0.28 },
    { text: t("workshop.heroTitleEm"), em: true, delay: 0.41 },
  ];

  return (
    <div className="flex flex-col">
      <p className="wsp-anim mb-7 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[#e2c08a] opacity-0 [animation:wsp-rise_0.8s_0.1s_ease-out_forwards]">
        <span aria-hidden="true" className="inline-block h-px w-8 bg-[#c99a5f]" />
        {t("workshop.heroKicker")}
      </p>

      <h1
        className={`${font} m-0 text-[13vw] font-light leading-[0.94] tracking-[-0.025em] sm:text-[68px] lg:text-[80px] xl:text-[92px]`}
      >
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.04em]">
            <span
              className="wsp-anim inline-block [animation:wsp-mask_0.9s_both_cubic-bezier(0.16,1,0.3,1)]"
              style={{ animationDelay: `${line.delay}s` }}
            >
              {line.em ? <em className="italic text-[#e2c08a]">{line.text}</em> : line.text}
            </span>
          </span>
        ))}
      </h1>

      <p className="wsp-anim mt-8 max-w-[440px] text-[15.5px] leading-[1.65] text-[#f6f1e9]/70 opacity-0 [animation:wsp-rise_0.8s_0.55s_ease-out_forwards]">
        {t("workshop.heroSubtitle")}
      </p>

      <div className="wsp-anim mt-9 flex flex-wrap gap-3 opacity-0 [animation:wsp-rise_0.8s_0.68s_ease-out_forwards]">
        <Link
          href="/products"
          className="rounded-[2px] bg-[#f6f1e9] px-7 py-3.5 text-[13.5px] font-medium tracking-[0.02em] text-[#17140f] transition-colors hover:bg-[#e2c08a]"
        >
          {t("workshop.heroCtaPrimary")}
        </Link>
        <Link
          href="/contact"
          className="rounded-[2px] border border-[#f6f1e9]/40 px-7 py-3.5 text-[13.5px] tracking-[0.02em] text-[#f6f1e9] transition-colors hover:border-[#e2c08a] hover:text-[#e2c08a]"
        >
          {t("workshop.heroCtaSecondary")}
        </Link>
      </div>
    </div>
  );
}
