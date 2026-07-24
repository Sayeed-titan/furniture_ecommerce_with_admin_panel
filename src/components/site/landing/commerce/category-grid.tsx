"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/use-translation";

export type CommerceCategoryItem = {
  name: string;
  slug: string;
  imageUrl: string | null;
  count: number;
};

/**
 * Category tiles. Receives plain data (no Prisma Decimal) so it can be a
 * Client Component and translate its own count label. Category names come
 * straight from the DB — already the correct office/industrial/hospital set.
 */
export function CommerceCategoryGrid({ items }: { items: CommerceCategoryItem[] }) {
  const { t } = useTranslation();

  return (
    <section className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {t("commerce.categoriesTitle")}
          </h2>
          <p className="mt-1.5 text-neutral-600">{t("commerce.categoriesSubtitle")}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl bg-neutral-200"
            >
              {cat.imageUrl && (
                <Image
                  src={cat.imageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="relative p-4">
                <p className="font-semibold text-white">{cat.name}</p>
                <p className="text-xs text-white/75">
                  {cat.count}{" "}
                  {cat.count === 1 ? t("commerce.categoriesItemOne") : t("commerce.categoriesItemMany")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
