"use client";

import Link from "next/link";
import { Boxes, PencilRuler, Truck } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";

/**
 * Three service value-props — the B2B equivalents of a storefront's promo
 * tiles. No invented discounts; each states something the business actually
 * does and links somewhere useful.
 */
export function CommercePromoTiles() {
  const { t } = useTranslation();

  const tiles = [
    {
      icon: Boxes,
      title: t("commerce.tilesBulkTitle"),
      desc: t("commerce.tilesBulkDesc"),
      href: "/contact",
    },
    {
      icon: PencilRuler,
      title: t("commerce.tilesCustomTitle"),
      desc: t("commerce.tilesCustomDesc"),
      href: "/contact",
    },
    {
      icon: Truck,
      title: t("commerce.tilesDeliveryTitle"),
      desc: t("commerce.tilesDeliveryDesc"),
      href: "/delivery",
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        {tiles.map(({ icon: Icon, title, desc, href }) => (
          <Link
            key={title}
            href={href}
            className="group flex items-start gap-4 rounded-xl border border-neutral-200 p-6 transition-colors hover:border-[#e8873a]/60 hover:bg-neutral-50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white transition-colors group-hover:bg-[#c2570f]">
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-semibold text-neutral-900">{title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-neutral-600">{desc}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
