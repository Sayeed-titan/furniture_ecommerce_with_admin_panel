"use client";

import { useTranslation } from "@/lib/i18n/use-translation";
import { useWorkshopDisplayFont } from "./chrome";

/**
 * A quiet three-up band of service promises (consultation, delivery, trade)
 * in a hairline grid. Pure translated text — a single Client Component.
 */
export function WorkshopServicesRow() {
  const { t } = useTranslation();
  const font = useWorkshopDisplayFont();

  const services = [
    { title: t("workshop.svc1Title"), body: t("workshop.svc1Body") },
    { title: t("workshop.svc2Title"), body: t("workshop.svc2Body") },
    { title: t("workshop.svc3Title"), body: t("workshop.svc3Body") },
  ];

  return (
    <section className="bg-[#f6f1e9] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px border border-[#d3c8b5] bg-[#d3c8b5] sm:grid-cols-3">
        {services.map((s) => (
          <div key={s.title} className="flex flex-col gap-2.5 bg-[#f6f1e9] p-8">
            <span className={`${font} text-[22px] text-[#17140f]`}>{s.title}</span>
            <span className="text-[13.5px] leading-[1.65] text-[#6f675b]">{s.body}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
