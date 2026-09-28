/**
 * Product code generator — a plain template string with a handful of
 * recognized `{TOKEN}` placeholders. Anything else in the pattern (literal
 * text, dashes, a hand-typed "V1" for a product line/version) passes
 * through untouched, so there's no need for a dedicated "version" token —
 * the admin just types it directly into the pattern.
 *
 * Recognized tokens:
 *   {BRAND}      - the brand code from Settings (e.g. "PF")
 *   {CATEGORY}   - the product's category shortCode (e.g. "SC")
 *   {SEQ} / {SEQ:n} - the category's running sequence number, zero-padded
 *                     to n digits (default 3, e.g. {SEQ:3} -> "007")
 *   {YEAR}       - current 4-digit year
 *   {YY}         - current 2-digit year
 */

export const DEFAULT_PRODUCT_CODE_PATTERN = "{BRAND}-{CATEGORY}-{SEQ:3}";
export const DEFAULT_PRODUCT_CODE_BRAND = "PF";

export type ProductCodeContext = {
  brand: string;
  categoryShortCode: string;
  seq: number;
};

export function renderProductCode(pattern: string, ctx: ProductCodeContext): string {
  const now = new Date();
  return pattern
    .replace(/\{BRAND\}/g, ctx.brand)
    .replace(/\{CATEGORY\}/g, ctx.categoryShortCode)
    .replace(/\{YEAR\}/g, String(now.getFullYear()))
    .replace(/\{YY\}/g, String(now.getFullYear()).slice(-2))
    .replace(/\{SEQ(?::(\d+))?\}/g, (_match, digits) => {
      const width = digits ? Number(digits) : 3;
      return String(ctx.seq).padStart(width, "0");
    });
}
