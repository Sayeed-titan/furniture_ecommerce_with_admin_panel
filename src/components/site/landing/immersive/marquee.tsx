const PHRASES = [
  "Solid Wood",
  "Full-Grain Leather",
  "Engineered Wood",
  "Hand-Finished",
  "Built to Last",
  "Home & Office",
];

/**
 * Continuous materials ticker. Pure CSS animation, disabled under
 * prefers-reduced-motion. Moving copy is aria-hidden; screen readers get a
 * single static sentence instead.
 */
export function MaterialsMarquee() {
  const run = PHRASES.join("   ·   ") + "   ·   ";

  return (
    <div className="overflow-hidden border-y border-neutral-200 bg-neutral-50 py-3">
      <style>{`
        @keyframes im-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .im-marquee { animation: im-marquee 30s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .im-marquee { animation: none; } }
      `}</style>
      <p className="sr-only">{PHRASES.join(". ")}.</p>
      <div className="im-marquee flex w-max whitespace-nowrap" aria-hidden="true">
        <span className="px-4 text-sm font-medium uppercase tracking-wide text-neutral-500">
          {run}
        </span>
        <span className="px-4 text-sm font-medium uppercase tracking-wide text-neutral-500">
          {run}
        </span>
      </div>
    </div>
  );
}
