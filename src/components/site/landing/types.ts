import type { Category, Material, Product, ProductImage } from "@prisma/client";

export type LandingProduct = Product & { images: ProductImage[]; material: Material };

export type LandingCategory = Category & {
  _count: { products: number };
  products: LandingProduct[];
};

/** Admin-editable overrides for the Commerce variant's hero banner — any
 *  field left null falls back to the built-in default text/link. */
export type HeroContent = {
  eyebrow: string | null;
  headline: string | null;
  subtitle: string | null;
  primaryLabel: string | null;
  primaryHref: string | null;
  secondaryLabel: string | null;
  secondaryHref: string | null;
};

/**
 * Data every landing page variant receives. Kept as plain props (no Prisma
 * calls inside variants) so a variant stays portable — the same component
 * can be dropped into another project by feeding it differently-sourced data
 * that matches this shape.
 */
export interface LandingPageData {
  featuredProducts: LandingProduct[];
  categories: LandingCategory[];
  materials: Material[];
  /** Only consumed by the Commerce variant's hero — other variants ignore these. */
  heroContent: HeroContent;
  heroSlides: string[];
}

export type LandingVariantComponent = (props: LandingPageData) => React.ReactNode;

/**
 * Add a key here whenever a new variant is built, then register it in
 * registry.ts. This is the single place that documents which variants exist.
 */
export type LandingVariantKey =
  | "generic"
  | "creative_fable5"
  | "premium"
  | "immersive"
  | "president"
  | "commerce"
  | "showroom";
