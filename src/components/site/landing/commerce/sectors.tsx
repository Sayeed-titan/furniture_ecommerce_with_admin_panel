"use client";

import Link from "next/link";
import { Building2, Factory, HeartPulse, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";

/**
 * The three markets President serves. Each card links into the catalogue
 * pre-filtered by setting, so it doubles as primary navigation.
 */
export function CommerceSectors() {
  const { t } = useTranslation();

  const sectors = [
    {
      icon: Building2,
      title: t("commerce.sectorOffice"),
      desc: t("commerce.sectorOfficeDesc"),
      href: "/products?room=OFFICE",
    },
    {
      icon: Factory,
      title: t("commerce.sectorIndustrial"),
      desc: t("commerce.sectorIndustrialDesc"),
      href: "/products?room=INDUSTRIAL",
    },
    {
      icon: HeartPulse,
      title: t("commerce.sectorHospital"),
      desc: t("commerce.sectorHospitalDesc"),
      href: "/products?room=HEALTHCARE",
    },
  ];

  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px overflow-hidden bg-neutral-200 sm:grid-cols-3 sm:rounded-none">
        {sectors.map(({ icon: Icon, title, desc, href }) => (
          <Link
            key={title}
            href={href}
            className="group flex flex-col gap-3 bg-white p-8 transition-colors hover:bg-neutral-50"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8873a]/12 text-[#c2570f]">
              <Icon className="h-5 w-5" />
            </span>
            <span className="mt-1 flex items-center gap-1.5 text-lg font-semibold text-neutral-900">
              {title}
              <ArrowRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#c2570f]" />
            </span>
            <span className="text-sm leading-relaxed text-neutral-600">{desc}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
