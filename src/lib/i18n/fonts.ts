import { Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";

/**
 * Bangla body/UI font — pairs with the English Geist Sans.
 * Applied site-wide (via LocaleProvider) whenever locale is "bn".
 */
export const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/**
 * Bangla display font — pairs with the English Fraunces used for big
 * statement headings in the Immersive landing variant.
 */
export const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
