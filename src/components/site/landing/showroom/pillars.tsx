"use client";

import { Ruler, Hammer, Truck } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";

/**
 * Sits right below the dark 3D hero — a light band for contrast, three
 * pillars restating the same office/industrial/hospital promise in
 * concrete, no-nonsense terms.
 */
export function ShowroomPillars() {
  const { t } = useTranslation();

  const pillars = [
    { icon: Ruler, title: t("showroom.pillar1Title"), desc: t("showroom.pillar1Desc") },
    { icon: Hammer, title: t("showroom.pillar2Title"), desc: t("showroom.pillar2Desc") },
    { icon: Truck, title: t("showroom.pillar3Title"), desc: t("showroom.pillar3Desc") },
  ];

  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6 lg:px-8">
        {pillars.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#d9b779]/15 text-[#8a6a3f]">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold text-neutral-900">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
