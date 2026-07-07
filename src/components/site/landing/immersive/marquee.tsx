/**
 * Materials + services ticker. Mixes material callouts with the on-site
 * custom-build services so the strip reads as "workshop and crew", not just
 * a furniture shop.
 */
const PHRASES = [
  "Solid Wood",
  "Custom Built-Ins",
  "Full-Grain Leather",
  "On-Site Installation",
  "Engineered Wood",
  "Interior Woodwork",
  "Hand-Finished",
  "Custom Doors",
  "Made to Order",
  "Home & Office",
];

/** One full pass of the phrase list; rendered twice for a seamless loop. */
function Run() {
  return (
    <div className="flex w-max items-center">
      {PHRASES.map((phrase) => (
        <span key={phrase} className="flex items-center">
          <span className="px-6 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            {phrase}
          </span>
          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 rounded-[1px] bg-neutral-300" />
        </span>
      ))}
    </div>
  );
}

/**
 * Continuous ticker. Pure CSS animation with soft edge fades and
 * pause-on-hover; disabled under prefers-reduced-motion. Moving copy is
 * aria-hidden; screen readers get a single static sentence instead.
 */
export function MaterialsMarquee() {
  return (
    <div
      className="im-marquee-wrap overflow-hidden border-y border-neutral-200 bg-neutral-50 py-3.5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <style>{`
        @keyframes im-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .im-marquee { animation: im-marquee 42s linear infinite; will-change: transform; }
        .im-marquee-wrap:hover .im-marquee { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .im-marquee { animation: none; } }
      `}</style>
      <p className="sr-only">{PHRASES.join(". ")}.</p>
      <div className="im-marquee flex w-max" aria-hidden="true">
        <Run />
        <Run />
      </div>
    </div>
  );
}
