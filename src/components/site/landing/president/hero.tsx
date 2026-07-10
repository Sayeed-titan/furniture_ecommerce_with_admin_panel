"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useTranslation, useDisplayFontClassName } from "@/lib/i18n/use-translation";
import { SilkCanvas } from "./silk-canvas";

/** Split a string into grapheme clusters so Bengali conjuncts stay intact. */
function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

/**
 * Full-viewport hero: the WebGL silk field behind an enormous kinetic
 * wordmark whose letters rise out of a clipped baseline one by one —
 * the "curtain lift" moment the rest of the page descends from.
 */
export function PresidentHero() {
  const { t, locale } = useTranslation();
  const displayFont = useDisplayFontClassName();

  const title = t("president.heroTitle");
  // Bengali's matra (headstroke) must run unbroken across the word, so the
  // per-letter stagger is Latin-only; bn lifts the whole word as one piece.
  const chars = useMemo(
    () => (locale === "bn" ? [title] : graphemes(title)),
    [title, locale]
  );

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#14100c] text-[#f4efe6]">
      {/* CSS gradient fallback + WebGL silk field */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_10%,#2a2018_0%,#14100c_60%)]" />
      <SilkCanvas className="absolute inset-0 h-full w-full" />
      {/* Grain + bottom fade into the next section */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,16,12,0.25),transparent_30%,transparent_62%,#14100c_100%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-28 pt-24 sm:px-6 lg:px-8">
        {/* Kicker */}
        <p
          className="pres-anim mb-6 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.5em] text-[#d9b779] opacity-0 [animation:pres-fade-up_0.9s_0.15s_cubic-bezier(0.22,1,0.36,1)_forwards]"
        >
          <span aria-hidden="true" className="h-px w-12 bg-[#b8925a]/70" />
          {t("president.heroKicker")}
        </p>

        {/* Kinetic wordmark */}
        <h1
          aria-label={title}
          className={`${displayFont} select-none text-[17vw] font-semibold tracking-[-0.015em] sm:text-[13vw] lg:text-[10.5rem] ${
            locale === "bn" ? "leading-[1.2]" : "leading-[0.94]"
          }`}
        >
          {chars.map((ch, i) => (
            <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              {/* fill-mode "both" holds the below-the-clip "from" frame during
                  each letter's stagger delay (a translate-y utility would set
                  the separate `translate` property and never be animated away) */}
              <span
                className="pres-anim inline-block [animation:pres-rise_0.9s_cubic-bezier(0.22,1,0.36,1)_both]"
                style={{ animationDelay: `${0.25 + i * 0.055}s` }}
              >
                {ch === " " ? " " : ch}
              </span>
            </span>
          ))}
        </h1>

        {/* Tagline */}
        <p
          className={`${displayFont} pres-anim mt-6 max-w-2xl text-xl italic leading-relaxed text-[#f4efe6]/75 opacity-0 [animation:pres-fade-up_0.9s_1.15s_cubic-bezier(0.22,1,0.36,1)_forwards] sm:text-2xl`}
        >
          {t("president.heroTagline")}
        </p>

        {/* CTAs */}
        <div className="pres-anim mt-10 flex flex-wrap items-center gap-4 opacity-0 [animation:pres-fade-up_0.9s_1.35s_cubic-bezier(0.22,1,0.36,1)_forwards]">
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 rounded-full bg-[#d9b779] px-7 py-3.5 text-sm font-semibold tracking-wide text-[#171310] transition-all duration-300 hover:bg-[#f4efe6] hover:shadow-[0_0_40px_rgba(217,183,121,0.35)]"
          >
            {t("president.ctaExplore")}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 rounded-full border border-[#f4efe6]/30 px-7 py-3.5 text-sm font-medium tracking-wide text-[#f4efe6] transition-colors duration-300 hover:border-[#d9b779] hover:text-[#d9b779]"
          >
            {t("president.ctaCustom")}
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pres-anim absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 [animation:pres-fade-up_0.9s_1.8s_ease_forwards]">
        <div className="flex flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-[0.4em] text-[#f4efe6]/50">
          {t("president.scrollCue")}
          <span aria-hidden="true" className="pres-anim block h-8 w-px bg-gradient-to-b from-[#d9b779] to-transparent [animation:pres-cue_2.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
