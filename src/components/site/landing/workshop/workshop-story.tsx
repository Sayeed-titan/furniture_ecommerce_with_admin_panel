import Image from "next/image";
import type { LandingProduct } from "@/components/site/landing/types";
import { Reveal } from "@/components/site/reveal";
import { newsreader } from "./fonts";
import { Eyebrow, DisplayHeading, TranslatedText } from "./chrome";

/**
 * The dark "we make it, so we can change it" break: the manufacturing story,
 * three counting stats, and a mosaic of real workshop pieces. Server
 * Component — pulls its mosaic from the featured products' images and falls
 * back to a woven texture when there aren't enough.
 */
export function WorkshopStory({ products }: { products: LandingProduct[] }) {
  const shots = products.flatMap((p) => p.images).slice(0, 3);

  const stats = [
    { value: "27", label: "workshop.stat1Label" },
    { value: "600+", label: "workshop.stat2Label" },
    { value: "1 yr", label: "workshop.stat3Label" },
  ];

  const weave = "repeating-linear-gradient(135deg,#241f18 0 9px,#2c261d 9px 18px)";

  return (
    <section className="bg-[#17140f] px-4 py-20 text-[#f6f1e9] sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <Reveal className="flex flex-col gap-6">
          <Eyebrow k="workshop.workshopKicker" tone="brass" />
          <DisplayHeading
            k="workshop.workshopTitle"
            className="text-[36px] font-light leading-[1.05] tracking-[-0.025em] sm:text-[50px]"
          />
          <p className="m-0 max-w-[470px] text-[15.5px] leading-[1.75] text-[#f6f1e9]/65">
            <TranslatedText k="workshop.workshopBody" />
          </p>
          <div className="mt-3 grid grid-cols-3 gap-6 sm:justify-items-start">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1.5">
                <span className={`${newsreader.className} text-[38px] leading-none sm:text-[42px]`}>
                  {s.value}
                </span>
                <span className="text-[11px] uppercase tracking-[0.12em] text-[#f6f1e9]/50">
                  <TranslatedText k={s.label} />
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120} className="grid aspect-[4/3] grid-cols-2 grid-rows-2 gap-3">
          <div className="relative row-span-2 overflow-hidden" style={{ background: weave }}>
            {shots[0] && (
              <Image
                src={shots[0].url}
                alt={shots[0].alt ?? ""}
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover"
              />
            )}
          </div>
          <div className="relative overflow-hidden" style={{ background: weave }}>
            {shots[1] && (
              <Image
                src={shots[1].url}
                alt={shots[1].alt ?? ""}
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover"
              />
            )}
          </div>
          <div className="relative overflow-hidden" style={{ background: weave }}>
            {shots[2] && (
              <Image
                src={shots[2].url}
                alt={shots[2].alt ?? ""}
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover"
              />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
