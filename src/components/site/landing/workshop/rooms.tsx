import Image from "next/image";
import Link from "next/link";
import type { LandingCategory } from "@/components/site/landing/types";
import { Reveal } from "@/components/site/reveal";
import { newsreader } from "./fonts";
import { hd, ROOM_FALLBACKS } from "./imagery";
import { Eyebrow, DisplayHeading, ArrowLink, TranslatedText } from "./chrome";

/**
 * "Built for every room" — an editorial category grid. Each card shows the
 * category's most recent piece as its cover (aspect 3/4), the name in the
 * display serif, and a short product count. Server Component: real category
 * data with images, no client JS beyond the translated heading leaves.
 */
export function WorkshopRooms({ categories }: { categories: LandingCategory[] }) {
  const rooms = categories.filter((c) => c._count.products > 0).slice(0, 8);
  if (rooms.length === 0) return null;

  return (
    <section className="bg-[#f6f1e9] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-4">
            <Eyebrow k="workshop.roomsKicker" />
            <DisplayHeading
              k="workshop.roomsTitle"
              className="text-[34px] leading-[1] tracking-[-0.02em] text-[#17140f] sm:text-[44px]"
            />
          </div>
          <ArrowLink href="/products" k="categoryShowcase.viewAll" className="mb-2" />
        </div>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {rooms.map((room, i) => {
            const cover = room.products[0]?.images[0];
            const coverSrc = hd(cover?.url, 900) ?? ROOM_FALLBACKS[i % ROOM_FALLBACKS.length];
            return (
              <Reveal key={room.id} delay={(i % 4) * 80}>
                <Link href={`/products?category=${room.slug}`} className="group flex flex-col gap-3.5">
                  <div className="relative aspect-[3/4] overflow-hidden border border-[#d3c8b5] bg-[#e6ddcd]">
                    <Image
                      src={coverSrc}
                      alt={cover?.alt ?? room.name}
                      fill
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span
                      className={`${newsreader.className} text-[21px] leading-tight text-[#17140f] transition-colors group-hover:text-[#9a6a3c]`}
                    >
                      {room.name}
                    </span>
                    <span className="text-[12.5px] text-[#6f675b]">
                      {room._count.products}{" "}
                      <TranslatedText
                        k={
                          room._count.products === 1
                            ? "categoryShowcase.itemsSingular"
                            : "categoryShowcase.itemsPlural"
                        }
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
