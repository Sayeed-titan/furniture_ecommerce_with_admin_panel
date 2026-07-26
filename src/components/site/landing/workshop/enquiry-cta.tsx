"use client";

import { useTranslation } from "@/lib/i18n/use-translation";
import { useWorkshopDisplayFont } from "./chrome";
import { LeadForm } from "@/components/site/lead-form";

/**
 * Closing enquiry band: an editorial invitation on the left, and the real
 * lead-capture form (posts to /api/leads) framed as a "quick enquiry" card on
 * the right — the design system's contact moment, wired to the live backend.
 */
export function WorkshopEnquiryCta() {
  const { t } = useTranslation();
  const font = useWorkshopDisplayFont();

  return (
    <section className="border-t border-[#d3c8b5] bg-[#efe7da] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="flex max-w-[560px] flex-col gap-5">
          <h2
            className={`${font} m-0 text-[40px] font-light leading-[1.03] tracking-[-0.03em] text-[#17140f] sm:text-[54px]`}
          >
            {t("workshop.enquiryTitle")}
            <br />
            <em className="italic text-[#9a6a3c]">{t("workshop.enquiryTitleEm")}</em>
          </h2>
          <p className="m-0 max-w-[480px] text-[15.5px] leading-[1.7] text-[#6f675b]">
            {t("workshop.enquiryBody")}
          </p>
        </div>

        <div className="w-full max-w-[400px] border border-[#d3c8b5] bg-[#fffdf9] p-6 sm:p-7 lg:shrink-0">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8073]">
            {t("workshop.enquiryFormHeading")}
          </p>
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
