"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { embedThumbnail } from "@/lib/video-embed";
import type { ProductMediaType } from "@prisma/client";

type GalleryImage = { id: string; url: string; alt: string | null; type: ProductMediaType };

function MainMedia({ item, productName }: { item: GalleryImage; productName: string }) {
  if (item.type === "IMAGE") {
    return (
      <Image
        src={item.url}
        alt={item.alt ?? productName}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 50vw, 100vw"
        priority
      />
    );
  }

  if (item.type === "VIDEO_FILE") {
    return <video src={item.url} controls playsInline className="h-full w-full object-cover" />;
  }

  return (
    <iframe
      src={item.url}
      title={productName}
      className="h-full w-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

function Thumb({ item }: { item: GalleryImage }) {
  if (item.type === "IMAGE") {
    return <Image src={item.url} alt="" fill className="object-cover" sizes="120px" />;
  }

  if (item.type === "VIDEO_FILE") {
    return (
      <>
        <video src={item.url} muted playsInline className="h-full w-full object-cover" />
        <Play className="absolute inset-0 m-auto h-6 w-6 text-onmedia drop-shadow" />
      </>
    );
  }

  const thumb = embedThumbnail(item.url);
  return (
    <>
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element -- third-party thumbnail CDN, not local/optimizable
        <img src={thumb} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center bg-neutral-800 text-[10px] font-medium text-white">
          Video
        </div>
      )}
      <Play className="absolute inset-0 m-auto h-6 w-6 text-onmedia drop-shadow" />
    </>
  );
}

/**
 * Main media + clickable thumbnail strip, mixing photos and video (uploaded
 * file or YouTube/Vimeo embed) in one gallery. The detail page used to only
 * ever render images[0] regardless of how many a product had, or what type —
 * this is what actually surfaces the rest of the gallery to visitors.
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
          <MainMedia item={active} productName={productName} />
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
                aria-label={`View item ${i + 1}`}
                aria-current={i === selected}
                className={cn(
                  "relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100 ring-2 ring-offset-1 transition-shadow",
                  i === selected ? "ring-neutral-900" : "ring-transparent hover:ring-neutral-300"
                )}
              >
                <Thumb item={img} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
