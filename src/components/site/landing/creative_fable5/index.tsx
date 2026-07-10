import Image from "next/image";
import Link from "next/link";
import type { LandingPageData } from "@/components/site/landing/types";
import { formatPrice } from "@/lib/utils";
import { MaterialMarquee } from "./marquee";
import { PieceCard } from "./piece-card";
import { Reveal } from "./reveal";

/**
 * Type 2 — Creative_Fable5: "The Workshop Folio"
 *
 * An editorial, design-magazine treatment: warm paper ground, oversized serif
 * headlines, hairline rules, numbered folio plates, a burnt-sienna accent and
 * an ink-dark "how it's made" chapter. Asymmetric, grid-breaking layouts
 * instead of boxed cards. Palette: paper #f5efe4, ink #1c1610, sienna #9c3d16.
 */

const CRAFT_STEPS = [
  {
    title: "Select",
    body: "Every board is chosen by hand — solid hardwoods, engineered woods for clean modern lines, full-grain leather that improves with every year it's owned.",
  },
  {
    title: "Join",
    body: "Mortise and tenon, dovetail, doweled frames. The joinery you never see is the reason a piece survives three house moves and two generations.",
  },
  {
    title: "Finish",
    body: "Oils and waxes rubbed in by hand, not sprayed on. The surface stays alive — it wears in, not out, and every scuff becomes part of the story.",
  },
];

function folio(i: number) {
  return String(i + 1).padStart(2, "0");
}

/* Layout recipe for the grid-breaking featured plates (cycled). */
const PLATE_LAYOUT = [
  { className: "sm:col-span-2 lg:col-span-7", aspect: "aspect-[4/3]", sizes: "(min-width: 1024px) 58vw, 100vw", large: true },
  { className: "lg:col-span-5 lg:mt-24", aspect: "aspect-[3/4]", sizes: "(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw", large: false },
  { className: "lg:col-span-4", aspect: "aspect-[4/5]", sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw", large: false },
  { className: "lg:col-span-4 lg:mt-16", aspect: "aspect-square", sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw", large: false },
  { className: "lg:col-span-4 lg:mt-32", aspect: "aspect-[4/5]", sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw", large: false },
  { className: "sm:col-span-2 lg:col-span-6", aspect: "aspect-[4/3]", sizes: "(min-width: 1024px) 50vw, 100vw", large: true },
];

export function CreativeFable5Landing({ featuredProducts, categories }: LandingPageData) {
  const heroProduct = featuredProducts[0];
  const heroImage = heroProduct?.images[0];
  const plates = featuredProducts.slice(0, PLATE_LAYOUT.length);

  return (
    <div className="bg-[#f5efe4] text-[#1c1610]">
      {/* ============ Masthead / hero ============ */}
      <header className="relative overflow-hidden">
        {/* issue meta line */}
        <div className="mx-auto flex max-w-7xl items-baseline justify-between gap-4 border-b border-[#1c1610] px-4 py-3 sm:px-6 lg:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em]">
            President Furniture
          </p>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-[#6b5a48] sm:block">
            Vol. 01 &mdash; The Workshop Issue
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#9c3d16]">
            Wood &middot; Leather &middot; Craft
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-12 lg:gap-6 lg:px-8 lg:pb-24 lg:pt-20">
          {/* headline block */}
          <div className="relative lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#9c3d16]">
              A feature on furniture worth keeping
            </p>
            <h1 className="mt-6 font-serif text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              Made of trees,
              <br />
              <span className="italic text-[#9c3d16]">meant for</span>
              <br />
              generations.
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-[#4a3e30] sm:text-lg">
              Solid wood, engineered wood and leather furniture for homes and
              offices &mdash; built in our workshop, finished by hand, and sold by
              people who will actually talk to you.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-3 bg-[#1c1610] px-7 py-4 font-mono text-xs uppercase tracking-[0.25em] text-[#f5efe4] transition-colors hover:bg-[#9c3d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9c3d16]"
              >
                Open the collection <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-2 py-4 font-mono text-xs uppercase tracking-[0.25em] text-[#1c1610] underline decoration-[#9c3d16] decoration-2 underline-offset-8 transition-colors hover:text-[#9c3d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9c3d16]"
              >
                Talk to the workshop
              </Link>
            </div>

            {/* vertical folio rail — decorative */}
            <p
              aria-hidden="true"
              className="absolute -left-2 top-1 hidden font-mono text-[10px] uppercase tracking-[0.4em] text-[#a8977f] [writing-mode:vertical-rl] lg:block"
            >
              Est. in the workshop &mdash; kept in the home
            </p>
          </div>

          {/* hero plate */}
          <div className="lg:col-span-5 lg:pl-6">
            {heroProduct ? (
              <Reveal>
                <figure>
                  <Link
                    href={`/products/${heroProduct.slug}`}
                    className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9c3d16]"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden border border-[#1c1610] bg-[#e7ddc9]">
                      {heroImage ? (
                        <Image
                          src={heroImage.url}
                          alt={heroImage.alt ?? heroProduct.name}
                          fill
                          preload
                          sizes="(min-width: 1024px) 40vw, 100vw"
                          className="object-cover motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="h-full w-full bg-[repeating-linear-gradient(105deg,#e7ddc9_0px,#e7ddc9_14px,#ddd0b6_14px,#ddd0b6_16px)]"
                        />
                      )}
                      <span
                        aria-hidden="true"
                        className="absolute right-3 top-3 bg-[#f5efe4] px-2 py-1 font-serif text-sm italic"
                      >
                        Plate No. 01
                      </span>
                    </div>
                    <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-[#1c1610] pt-2">
                      <span className="font-serif text-lg tracking-tight underline-offset-4 group-hover:underline">
                        {heroProduct.name}
                      </span>
                      <span className="font-mono text-sm">
                        {formatPrice(heroProduct.price.toString())}
                      </span>
                    </figcaption>
                  </Link>
                </figure>
              </Reveal>
            ) : (
              <div
                aria-hidden="true"
                className="hidden aspect-[3/4] border border-[#1c1610] bg-[repeating-linear-gradient(105deg,#e7ddc9_0px,#e7ddc9_14px,#ddd0b6_14px,#ddd0b6_16px)] lg:block"
              />
            )}
          </div>
        </div>
      </header>

      {/* ============ Materials ticker ============ */}
      <MaterialMarquee />

      {/* ============ How it's made ============ */}
      <section aria-labelledby="craft-heading" className="bg-[#1c1610] text-[#f5efe4]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#f5efe4]/25 pb-8">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#e08a5a]">
                  Chapter one
                </p>
                <h2 id="craft-heading" className="mt-4 font-serif text-4xl tracking-tight sm:text-6xl">
                  How a piece is made
                </h2>
              </div>
              <p className="max-w-xs font-mono text-xs uppercase tracking-[0.2em] leading-loose text-[#f5efe4]/60">
                Three steps. No shortcuts. The same way since day one.
              </p>
            </div>
          </Reveal>

          <ol className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {CRAFT_STEPS.map((step, i) => (
              <li key={step.title}>
                <Reveal delay={i * 120}>
                  <p aria-hidden="true" className="font-serif text-7xl italic leading-none text-[#e08a5a] sm:text-8xl">
                    {folio(i)}
                  </p>
                  <h3 className="mt-5 font-serif text-2xl tracking-tight">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#f5efe4]/75">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal>
            <blockquote className="mt-16 border-l-2 border-[#e08a5a] pl-6 md:mt-20 md:w-2/3">
              <p className="font-serif text-2xl italic leading-snug sm:text-3xl">
                &ldquo;A good table shouldn&rsquo;t just hold dinner. It should hold
                up at the estate sale, eighty years from now.&rdquo;
              </p>
              <footer className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-[#f5efe4]/60">
                &mdash; The workshop floor
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ============ Collection index (categories) ============ */}
      {categories.length > 0 && (
        <section aria-labelledby="collection-heading" className="border-b border-[#1c1610]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#9c3d16]">
                Chapter two &mdash; the index
              </p>
              <h2 id="collection-heading" className="mt-4 font-serif text-4xl tracking-tight sm:text-6xl">
                Browse by room &amp; kind
              </h2>
            </Reveal>

            <ul className="mt-12 border-t border-[#1c1610]">
              {categories.map((category, i) => {
                const thumb = category.products[0]?.images[0];
                return (
                  <li key={category.id} className="border-b border-[#1c1610]">
                    <Reveal delay={Math.min(i, 4) * 80}>
                      <Link
                        href={`/products?category=${category.slug}`}
                        className="group flex items-center gap-4 py-6 transition-colors hover:bg-[#ede4d2] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#9c3d16] sm:gap-8 sm:py-8"
                      >
                        <span
                          aria-hidden="true"
                          className="w-10 shrink-0 font-serif text-lg italic text-[#9c3d16] sm:w-14 sm:text-xl"
                        >
                          {folio(i)}
                        </span>
                        <span className="min-w-0 flex-1 font-serif text-3xl tracking-tight transition-transform motion-safe:duration-300 group-hover:translate-x-2 sm:text-5xl lg:text-6xl">
                          {category.name}
                        </span>
                        <span className="hidden shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-[#6b5a48] sm:block">
                          {category._count.products}{" "}
                          {category._count.products === 1 ? "piece" : "pieces"}
                        </span>
                        {thumb && (
                          <span className="relative hidden h-20 w-28 shrink-0 overflow-hidden border border-[#1c1610] md:block">
                            <Image
                              src={thumb.url}
                              alt=""
                              fill
                              sizes="112px"
                              className="object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-110"
                            />
                          </span>
                        )}
                        <span
                          aria-hidden="true"
                          className="shrink-0 font-serif text-2xl text-[#9c3d16] transition-transform motion-safe:duration-300 group-hover:translate-x-1 sm:text-3xl"
                        >
                          &rarr;
                        </span>
                      </Link>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* ============ Featured plates ============ */}
      {plates.length > 0 && (
        <section aria-labelledby="plates-heading">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#9c3d16]">
                    Chapter three &mdash; the plates
                  </p>
                  <h2 id="plates-heading" className="mt-4 font-serif text-4xl tracking-tight sm:text-6xl">
                    Pieces worth falling for
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="font-mono text-xs uppercase tracking-[0.25em] underline decoration-[#9c3d16] decoration-2 underline-offset-8 transition-colors hover:text-[#9c3d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9c3d16]"
                >
                  View every piece &rarr;
                </Link>
              </div>
            </Reveal>

            <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-10">
              {plates.map((product, i) => {
                const layout = PLATE_LAYOUT[i % PLATE_LAYOUT.length];
                return (
                  <Reveal key={product.id} delay={(i % 3) * 100} className={layout.className}>
                    <PieceCard
                      product={product}
                      index={i}
                      aspect={layout.aspect}
                      sizes={layout.sizes}
                      large={layout.large}
                    />
                  </Reveal>
                );
              })}
            </div>

            <p className="mt-16 border-t border-[#1c1610] pt-6 text-center font-mono text-xs uppercase tracking-[0.25em] text-[#6b5a48]">
              Tap the heart on any plate to keep it in your{" "}
              <Link
                href="/wishlist"
                className="text-[#9c3d16] underline underline-offset-4 hover:text-[#1c1610] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9c3d16]"
              >
                wishlist
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* ============ Lead CTA ============ */}
      <section aria-labelledby="cta-heading" className="border-t border-[#1c1610] bg-[#9c3d16] text-[#f5efe4]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#f5efe4]/70">
              The last page
            </p>
            <h2 id="cta-heading" className="mt-6 max-w-3xl font-serif text-4xl leading-tight tracking-tight sm:text-6xl">
              Fell for a piece? <span className="italic">Save it</span> &mdash; we&rsquo;ll
              take it from there.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#f5efe4]/85">
              Build a wishlist, leave your details, and someone from the workshop
              &mdash; not a chatbot &mdash; will get in touch about pricing, custom
              sizes and delivery.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/wishlist"
                className="inline-flex items-center gap-3 bg-[#f5efe4] px-7 py-4 font-mono text-xs uppercase tracking-[0.25em] text-[#1c1610] transition-colors hover:bg-[#1c1610] hover:text-[#f5efe4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5efe4]"
              >
                Open my wishlist
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 border border-[#f5efe4] px-7 py-4 font-mono text-xs uppercase tracking-[0.25em] text-[#f5efe4] transition-colors hover:bg-[#f5efe4] hover:text-[#9c3d16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5efe4]"
              >
                Start a conversation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
