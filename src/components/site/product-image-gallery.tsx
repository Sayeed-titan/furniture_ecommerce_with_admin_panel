"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type GalleryImage = { id: string; url: string; alt: string | null };

/**
 * Main image + clickable thumbnail strip. The detail page used to only ever
 * render images[0] regardless of how many a product had — this is what
 * actually surfaces the rest of the gallery to visitors.
 */
export function ProductImageGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [selected, setSelected] = useState(0);
  const active = images[selected];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
        {active ? (
          <Image
            src={active.url}
            alt={active.alt ?? productName}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">
            No image
          </div>
        )}
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === selected}
                className={cn(
                  "relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100 ring-2 ring-offset-1 transition-shadow",
                  i === selected ? "ring-neutral-900" : "ring-transparent hover:ring-neutral-300"
                )}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
