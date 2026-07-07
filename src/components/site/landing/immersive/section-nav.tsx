"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/use-translation";

const SECTION_IDS = ["hero", "why-us", "explore", "trending", "craft", "connect"] as const;
const CHAPTER_KEYS: Record<(typeof SECTION_IDS)[number], string> = {
  hero: "chapters.hero",
  "why-us": "chapters.whyUs",
  explore: "chapters.explore",
  trending: "chapters.trending",
  craft: "chapters.craft",
  connect: "chapters.connect",
};

/**
 * Fixed right-side chapter nav: shows every section up front (so the
 * visitor always knows what's next), highlights the one in view, and jumps
 * straight there on click. Desktop only — there are too few pixels on
 * mobile for a persistent side rail.
 */
export function SectionNav() {
  const { t } = useTranslation();
  const [active, setActive] = useState<string>(SECTION_IDS[0]);
  const sections = SECTION_IDS.map((id) => ({ id, label: t(CHAPTER_KEYS[id]) }));

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) setActive(mostVisible.target.id);
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: [0.1, 0.25, 0.5, 0.75, 1] }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="group flex items-center gap-2 focus-visible:outline-none"
            aria-current={isActive ? "true" : undefined}
          >
            <span
              className={cn(
                "pointer-events-none max-w-0 overflow-hidden whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-all duration-200",
                "group-hover:max-w-[10rem] group-hover:opacity-100 group-focus-visible:max-w-[10rem] group-focus-visible:opacity-100",
                isActive && "max-w-[10rem] opacity-100"
              )}
            >
              {s.label}
            </span>
            <span
              className={cn(
                "h-2.5 w-2.5 shrink-0 rounded-full border transition-all duration-200 group-focus-visible:ring-2 group-focus-visible:ring-neutral-900 group-focus-visible:ring-offset-2",
                isActive
                  ? "scale-125 border-neutral-900 bg-neutral-900"
                  : "border-neutral-400 bg-white/60 group-hover:border-neutral-900"
              )}
            />
          </a>
        );
      })}
    </nav>
  );
}
