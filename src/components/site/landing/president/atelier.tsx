"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation, useDisplayFontClassName } from "@/lib/i18n/use-translation";

/** Counts up from 0 when scrolled into view. */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let raf = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      raf = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1600;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(to * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

/**
 * The Atelier — the custom on-site woodwork story, told typographically on a
 * cream "paper" break from the dark theme, with brass stat counters.
 */
export function Atelier() {
  const { t } = useTranslation();
  const displayFont = useDisplayFontClassName();

  const stats: { to: number; suffix: string; label: string }[] = [
    { to: 25, suffix: "+", label: t("president.stat1") },
    { to: 1200, suffix: "+", label: t("president.stat2") },
    { to: 100, suffix: "%", label: t("president.stat3") },
  ];

  return (
    <section className="bg-[#f4efe6] px-4 py-24 text-[#171310] sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="mb-6 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.5em] text-[#8a6a3f]">
            <span aria-hidden="true" className="h-px w-12 bg-[#8a6a3f]/70" />
            {t("president.atelierKicker")}
          </p>
          <h2 className={`${displayFont} text-4xl font-medium leading-tight sm:text-6xl`}>
            {t("president.atelierTitle")}{" "}
            <em className="text-[#8a6a3f]">{t("president.atelierTitleEm")}</em>
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#171310]/70">
            {t("president.atelierBody")}
          </p>
          <Link
            href="/contact"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#171310] px-7 py-3.5 text-sm font-semibold tracking-wide text-[#f4efe6] transition-colors duration-300 hover:bg-[#8a6a3f]"
          >
            {t("president.atelierCta")}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="flex flex-col justify-center gap-10 border-[#171310]/15 lg:col-span-5 lg:border-l lg:pl-14">
          {stats.map(({ to, suffix, label }) => (
            <div key={label} className="border-b border-[#171310]/10 pb-8 last:border-b-0 last:pb-0">
              <p className={`${displayFont} text-6xl font-medium text-[#8a6a3f] sm:text-7xl`}>
                <CountUp to={to} suffix={suffix} />
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-[#171310]/60">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
