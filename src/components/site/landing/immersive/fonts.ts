import { Fraunces } from "next/font/google";

/**
 * Display font for this variant only — used sparingly on big statement
 * headings, not body copy. Scoped to this folder so it doesn't affect
 * Type 1/2/3 or add weight to pages that don't use it.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
