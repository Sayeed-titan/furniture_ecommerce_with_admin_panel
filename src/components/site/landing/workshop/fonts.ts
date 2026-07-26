import { Newsreader } from "next/font/google";

/**
 * Display serif for the Workshop variant only (Type 6). A literary,
 * low-contrast serif with true italics — used on big statement headings and
 * product/category names, never on body copy. Scoped to this folder so it
 * adds no weight to the other variants or to pages that don't use it.
 */
export const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});
