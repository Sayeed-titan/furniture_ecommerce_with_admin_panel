"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useWorkshopDisplayFont } from "./chrome";
import { Reveal } from "@/components/site/reveal";

/**
 * The two ways to buy, side by side: take a finished piece home, or have us
 * build it where it lives. Split into two hairline-separated cells with
 * numbered mono eyebrows — the editorial "01 / 02" spread from the design
 * system. Pure translated text, so a single Client Component.
 */
export function WorkshopPaths() {
  const { t } = useTranslation();
  const font = useWorkshopDisplayFont();

  const paths = [
    {
      index: "01",
      eyebrow: t("workshop.path1Eyebrow"),
      title: t("services.card1Title"),
      body: t("services.card1Body"),
      cta: t("services.card1Cta"),
      href: "/products",
      bg: "bg-[#f6f1e9]",
    },
    {
      index: "02",
      eyebrow: t("workshop.path2Eyebrow"),
      title: t("services.card3Title"),
      body: t("services.card3Body"),
      cta: t("services.card3Cta"),
      href: "/contact",
      bg: "bg-[#efe7da]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-px border-y border-[#d3c8b5] bg-[#d3c8b5] md:grid-cols-2">
      {paths.map((p, i) => (
        <Reveal key={p.index} delay={i * 90} className={p.bg}>
          <div className="flex h-full flex-col gap-5 px-6 py-14 sm:px-10 lg:px-14">
            <span className="font-mono text-[11px] tracking-[0.14em] text-[#9a6a3c]">
              {p.index} / {p.eyebrow}
            </span>
            <h2 className={`${font} m-0 text-[30px] leading-[1.08] tracking-[-0.02em] sm:text-[38px]`}>
              {p.title}
            </h2>
            <p className="m-0 max-w-[440px] text-[15px] leading-[1.7] text-[#6f675b]">{p.body}</p>
            <Link
              href={p.href}
              className="group mt-2 inline-flex items-center gap-2 self-start border-b border-[#17140f] pb-1 text-[13px] tracking-[0.02em] text-[#17140f] transition-colors hover:border-[#9a6a3c] hover:text-[#9a6a3c]"
            >
              {p.cta}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
