import Image from "next/image";
import Link from "next/link";
import type { LandingCategory } from "@/components/site/landing/types";
import { Reveal } from "@/components/site/reveal";
import { Eyebrow, DisplayHeading, TranslatedText } from "./chrome";

/**
 * The Index — an editorial table of contents for the catalogue: numbered
 * hairline rows; hovering a row lights it in brass and floats a preview of
 * the category's first piece (CSS-only, desktop). Server Component.
 */
export function CategoryIndex({ categories }: { categories: LandingCategory[] }) {
  const rows = categories.filter((c) => c._count.products > 0);
  if (rows.length === 0) return null;

  return (
    <section className="bg-[#14100c] px-4 py-24 text-[#f4efe6] sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <Eyebrow k="president.categoriesKicker" className="mb-6" />
          <DisplayHeading
            k="president.categoriesTitle"
            className="text-4xl font-medium leading-tight sm:text-6xl"
          />
        </Reveal>

        <div className="mt-14 border-t border-[#f4efe6]/10">
          {rows.map((category, i) => {
            const preview = category.products[0]?.images[0];
            return (
              <Reveal key={category.id} delay={60 * i}>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group relative flex items-baseline justify-between gap-6 border-b border-[#f4efe6]/10 py-7 transition-colors duration-300 hover:border-[#d9b779]/50 sm:py-9"
                >
                  <span className="flex items-baseline gap-6 sm:gap-10">
                    <span className="font-mono text-xs tracking-[0.3em] text-[#b8925a]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-3xl font-medium tracking-tight transition-all duration-300 group-hover:translate-x-2 group-hover:text-[#d9b779] sm:text-5xl [font-family:var(--font-display),serif]">
                      {category.name}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm text-[#f4efe6]/50">
                    {category._count.products}{" "}
                    <TranslatedText
                      k={category._count.products === 1 ? "president.piece" : "president.pieces"}
                    />
                  </span>

                  {/* Floating preview (desktop, CSS-only) */}
                  {preview && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-24 top-1/2 z-10 hidden h-40 w-32 -translate-y-1/2 rotate-3 overflow-hidden opacity-0 shadow-2xl transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100 lg:block"
                    >
                      <Image
                        src={preview.url}
                        alt=""
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </span>
                  )}
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
