"use client";

import { useTranslation } from "@/lib/i18n/use-translation";
import { newsreader } from "./fonts";

/**
 * Slow serif marquee of the rooms and materials we build for. Copy is drawn
 * from the shared room/material/stock dictionaries so it stays bilingual
 * without new keys. Content is duplicated once so the -50% translate loops
 * seamlessly; it pauses entirely under prefers-reduced-motion (see globals).
 */
export function WorkshopMarquee() {
  const { t } = useTranslation();

  const items = [
    t("rooms.LIVING_ROOM"),
    t("rooms.BEDROOM"),
    t("rooms.DINING_ROOM"),
    t("rooms.OFFICE"),
    t("materials.SOLID_WOOD"),
    t("materials.LEATHER"),
    t("materials.ENGINEERED_WOOD"),
    t("stock.MADE_TO_ORDER"),
  ];

  return (
    <div className="flex overflow-hidden border-t border-[#f6f1e9]/12 bg-[#17140f] py-3.5">
      <div
        className={`${newsreader.className} wsp-marquee flex shrink-0 items-center gap-12 whitespace-nowrap pr-12 text-[19px] text-[#f6f1e9]/55 [animation:wsp-marquee_34s_linear_infinite]`}
        aria-hidden="true"
      >
        {[...items, ...items].map((label, i) => (
          <span key={i} className="flex items-center gap-12">
            {label}
            <span className="text-[#c99a5f]">&middot;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
