import Image from "next/image";
import Link from "next/link";
import type { Material } from "@prisma/client";
import type { LandingProduct } from "@/components/site/landing/types";
import { Reveal } from "@/components/site/reveal";
import { MaterialLabel } from "@/components/site/material-label";
import { MaterialShowcaseHeading } from "./material-showcase-heading";

/**
 * Stays a Server Component — `products` carries a Decimal price field,
 * which can't cross into a Client Component as a prop. Translatable
 * heading lives in material-showcase-heading.tsx.
 */
export function MaterialShowcase({
  products,
  materials,
}: {
  products: LandingProduct[];
  materials: Material[];
}) {
  const tiles = materials.slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Reveal>
        <MaterialShowcaseHeading />
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((material, i) => {
          const match = products.find((p) => p.material.id === material.id);
          const image = match?.images[0];
          return (
            <Reveal key={material.id} delay={i * 80}>
              <Link
                href={`/products?material=${material.id}`}
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
                <span className="relative m-auto px-4 text-center text-lg font-medium text-onmedia">
                  <MaterialLabel name={material.name} nameBn={material.nameBn} />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
