import { cn } from "@/lib/utils";

/**
 * President Furniture brand assets.
 *
 * The mark — "The Throne" — is a hand-drawn high-back chair whose top rail
 * rises into three crown peaks: the presidency (crown) and the furniture
 * (chair) fused into a single continuous line drawing. Stroke-based and
 * `currentColor`-driven so it can be rendered in brass on ink, ink on cream,
 * or any theme a surface needs.
 */

export const BRAND = {
  name: "President",
  descriptor: "Furniture",
  full: "President Furniture",
  /** Core palette (also mirrored in the president landing variant). */
  ink: "#171310",
  cream: "#f4efe6",
  gold: "#b8925a",
  goldHi: "#d9b779",
} as const;

/** The Throne mark — crown-backed chair, single-weight line art. */
export function ThroneMark({ className, strokeWidth = 3.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Crown top rail: three peaks between the back posts */}
      <path d="M20 22 L26 13 L32 19 L38 13 L44 22" />
      {/* Back posts */}
      <path d="M20 22 V41" />
      <path d="M44 22 V41" />
      {/* Seat */}
      <path d="M15 41 H49" />
      {/* Legs, slightly splayed */}
      <path d="M18 41 L16 54" />
      <path d="M46 41 L48 54" />
      {/* Stretcher bar */}
      <path d="M17.2 49 H46.8" strokeWidth={strokeWidth * 0.72} />
    </svg>
  );
}

/**
 * Full lockup: mark tile + stacked wordmark. `tone` controls which surface
 * it sits on; the mark tile always renders the throne in brass.
 */
export function BrandLockup({
  tone = "light",
  className,
}: {
  /** light = ink text for light surfaces, dark = cream text for dark surfaces */
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-lg shadow-sm ring-1 ring-black/10"
        style={{ backgroundColor: BRAND.ink, color: BRAND.goldHi }}
      >
        <ThroneMark className="h-6 w-6" />
      </span>
      <span className="flex flex-col justify-center leading-none">
        <span
          className={cn(
            "font-serif text-[17px] font-semibold tracking-[0.02em]",
            tone === "light" ? "text-neutral-900" : "text-[#f4efe6]"
          )}
        >
          President
        </span>
        <span
          className={cn(
            "mt-1 text-[8.5px] font-medium uppercase tracking-[0.42em]",
            tone === "light" ? "text-neutral-500" : "text-[#b8925a]"
          )}
        >
          Furniture
        </span>
      </span>
    </span>
  );
}
