"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation, useDisplayFontClassName } from "@/lib/i18n/use-translation";

/**
 * The brand manifesto: three serif statements whose words brighten one by
 * one as the section scrolls into view — the classic award-site "reading
 * light" effect, driven by scroll position rather than a library.
 */
export function Manifesto() {
  const { t } = useTranslation();
  const displayFont = useDisplayFontClassName();
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let raf = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      raf = requestAnimationFrame(() => setProgress(1));
      return () => cancelAnimationFrame(raf);
    }
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 when the section top hits the viewport bottom, 1 when its
        // bottom clears the upper third.
        const total = rect.height + vh * 0.6;
        const seen = vh * 0.85 - rect.top;
        setProgress(Math.min(1, Math.max(0, seen / total)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const lines = [t("president.manifesto1"), t("president.manifesto2"), t("president.manifesto3")];
  const words = lines.flatMap((line, li) =>
    line.split(" ").map((w) => ({ w, endOfLine: false, li })).map((item, i, arr) =>
      i === arr.length - 1 ? { ...item, endOfLine: true } : item
    )
  );

  return (
    <section className="bg-[#14100c] px-4 py-28 sm:px-6 sm:py-36 lg:px-8">
      <div ref={ref} className="mx-auto max-w-4xl">
        <p className="mb-10 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.5em] text-[#b8925a]">
          <span aria-hidden="true" className="h-px w-12 bg-[#b8925a]/70" />
          {t("president.manifestoKicker")}
        </p>
        <p className={`${displayFont} text-3xl font-medium leading-snug sm:text-5xl sm:leading-tight`}>
          {words.map(({ w, endOfLine }, i) => {
            const lit = i / words.length < progress;
            return (
              <span key={i}>
                <span
                  className="transition-colors duration-500"
                  style={{ color: lit ? "#f4efe6" : "rgba(244,239,230,0.16)" }}
                >
                  {w}
                </span>
                {endOfLine ? <span className="block h-4 sm:h-6" aria-hidden="true" /> : " "}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
