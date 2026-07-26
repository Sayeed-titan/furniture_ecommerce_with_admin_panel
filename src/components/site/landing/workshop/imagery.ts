/**
 * HD imagery helpers for the Workshop variant.
 *
 * Real product/category photos always win; the curated shots below are HD
 * fallbacks so no section ever drops to a bare texture. The photo IDs are the
 * same verified furniture shots prisma/seed.ts ships with, on
 * images.unsplash.com — a host next.config.ts already allowlists, so
 * next/image can optimise them at runtime.
 */

const UNSPLASH = "images.unsplash.com";

/**
 * Return a crisp, auto-formatted HD render of an Unsplash source URL. Stored
 * seed images ask for a soft `w=800`; this rewrites the query to a larger,
 * sharper source (next/image then downscales per device). Non-Unsplash URLs
 * (e.g. Supabase uploads) pass through untouched.
 */
export function hd(url: string | undefined | null, w = 1200): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    if (u.hostname === UNSPLASH) {
      return `${u.origin}${u.pathname}?auto=format&fit=crop&w=${w}&q=80`;
    }
  } catch {
    /* not a parseable URL — leave it as-is */
  }
  return url;
}

const shot = (id: string, w = 1200) =>
  `https://${UNSPLASH}/${id}?auto=format&fit=crop&w=${w}&q=80`;

// Verified furniture photo IDs (mirrors prisma/seed.ts).
const SOFA = "photo-1555041469-a586c61ea9bc";
const DINING = "photo-1617104551722-3b2d51366400";
const DESK = "photo-1518455027359-f3f8164ba6bd";
const CHAIR = "photo-1567538096630-e0c55bd6374c";
const BED = "photo-1505693416388-ac5ce068fe85";
const STORAGE = "photo-1595428774223-ef52624120d2";

/** Hero "featured plate" fallback (portrait, higher-res). */
export const HERO_FALLBACK = shot(SOFA, 1500);

/** Cycled fallbacks for the featured-collection cards. */
export const COLLECTION_FALLBACKS = [shot(DESK), shot(CHAIR), shot(STORAGE), shot(BED)];

/** Cycled fallbacks for the room grid. */
export const ROOM_FALLBACKS = [
  shot(SOFA),
  shot(BED),
  shot(DINING),
  shot(DESK),
  shot(CHAIR),
  shot(STORAGE),
  shot(DINING),
  shot(SOFA),
];

/** The three craft shots behind the dark "workshop story" mosaic. */
export const WORKSHOP_SHOTS = [shot(DINING, 1000), shot(DESK, 1000), shot(STORAGE, 1000)];
