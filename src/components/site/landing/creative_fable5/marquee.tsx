const PHRASES = [
  "Solid wood",
  "Full-grain leather",
  "Hand-rubbed finishes",
  "Built to be kept",
  "Homes & offices",
  "Cut, joined, finished",
];

/**
 * Full-bleed materials ticker. Pure CSS animation, disabled under
 * prefers-reduced-motion. The moving copy is aria-hidden; screen readers get
 * a single static sentence instead.
 */
export function MaterialMarquee() {
  const run = PHRASES.map((p) => `${p} — `).join("");

  return (
    <div className="overflow-hidden border-y border-[#1c1610] bg-[#9c3d16] py-3 text-[#f5efe4]">
      <style>{`
        @keyframes wf-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .wf-marquee { animation: wf-marquee 32s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .wf-marquee { animation: none; } }
      `}</style>
      <p className="sr-only">{PHRASES.join(". ")}.</p>
      <div className="wf-marquee flex w-max whitespace-nowrap" aria-hidden="true">
        <span className="font-serif text-lg italic tracking-wide sm:text-xl">{run}</span>
        <span className="font-serif text-lg italic tracking-wide sm:text-xl">{run}</span>
      </div>
    </div>
  );
}
