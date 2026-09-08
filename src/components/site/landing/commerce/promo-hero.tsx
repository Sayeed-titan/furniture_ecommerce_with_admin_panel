"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";
import type { HeroContent } from "@/components/site/landing/types";

const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600";
const SLIDE_INTERVAL_MS = 6000;

/**
 * Merchandising banner: a wide workplace photo with a left-aligned overlay
 * card. Background rotates through admin-uploaded photos when more than one
 * is set (src/lib/actions/hero.ts); falls back to a single default photo.
 * Text/buttons are admin-editable overrides (/admin/hero) over the
 * dictionary defaults, so this stays translated when nothing's been set.
 */
export function CommercePromoHero({ content, slides }: { content: HeroContent; slides: string[] }) {
  const { t } = useTranslation();
  const photos = slides.length > 0 ? slides : [DEFAULT_PHOTO];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % photos.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [photos.length]);

  return (
    <section className="relative isolate overflow-hidden bg-[#0f1418]">
      {photos.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-1000 ${
            i === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* Just enough of a gradient behind the text column for legibility —
          the photo itself stays at full brightness and is the priority. */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:min-h-[600px] lg:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e8873a]">
            {content.eyebrow || t("commerce.heroEyebrow")}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-onmedia sm:text-5xl lg:text-6xl">
            {content.headline || t("commerce.heroTitle")}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-onmedia/75 sm:text-lg">
            {content.subtitle || t("commerce.heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={content.primaryHref || "/products"}
              className="group inline-flex items-center gap-2 rounded-md bg-[#e8873a] px-6 py-3 text-sm font-semibold text-[#1a1205] transition-colors hover:bg-[#f0a05c]"
            >
              {content.primaryLabel || t("commerce.heroCtaPrimary")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={content.secondaryHref || "/contact"}
              className="inline-flex items-center gap-2 rounded-md border border-onmedia/25 px-6 py-3 text-sm font-semibold text-onmedia transition-colors hover:border-onmedia/60 hover:bg-onmedia/5"
            >
              {content.secondaryLabel || t("commerce.heroCtaSecondary")}
            </Link>
          </div>

          {photos.length > 1 && (
            <div className="mt-8 flex items-center gap-1.5">
              {photos.map((src, i) => (
                <span
                  key={src}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex ? "w-6 bg-[#e8873a]" : "w-1.5 bg-onmedia/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
