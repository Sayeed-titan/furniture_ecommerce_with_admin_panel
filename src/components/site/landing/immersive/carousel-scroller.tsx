"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";

/**
 * The interactive shell (scroll ref + arrow buttons) only. Product cards are
 * rendered server-side and passed in as children — keeps Prisma Decimal
 * fields from ever having to cross the client boundary as serialized props.
 */
export function CarouselScroller({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-4 hidden justify-end gap-2 sm:flex">
        <button
          type="button"
          onClick={() => scrollByAmount(-320)}
          aria-label={t("trending.scrollLeft")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollByAmount(320)}
          aria-label={t("trending.scrollRight")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}
