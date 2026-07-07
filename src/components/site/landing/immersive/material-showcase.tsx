import Image from "next/image";
import Link from "next/link";
import type { LandingProduct } from "@/components/site/landing/types";
import { Reveal } from "@/components/site/reveal";
import { EnumLabel } from "@/components/site/enum-label";
import { MaterialShowcaseHeading } from "./material-showcase-heading";

const MATERIALS = ["SOLID_WOOD", "ARTIFICIAL_WOOD", "LEATHER", "ENGINEERED_WOOD"] as const;

/**
 * Stays a Server Component — `products` carries a Decimal price field,
 * which can't cross into a Client Component as a prop. Translatable
 * heading lives in material-showcase-heading.tsx.
 */
export function MaterialShowcase({ products }: { products: LandingProduct[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Reveal>
        <MaterialShowcaseHeading />
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {MATERIALS.map((material, i) => {
          const match = products.find((p) => p.material === material);
          const image = match?.images[0];
          return (
            <Reveal key={material} delay={i * 80}>
              <Link
                href={`/products?material=${material}`}
                className="group relative flex aspect-square overflow-hidden rounded-2xl bg-neutral-100"
              >
                {image ? (
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-neutral-200 to-neutral-100" />
                )}
                <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/45" />
                <span className="relative m-auto px-4 text-center text-lg font-medium text-white">
                  <EnumLabel group="materials" value={material} />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
