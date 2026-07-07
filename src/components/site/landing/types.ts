import type { Category, Product, ProductImage } from "@prisma/client";

export type LandingProduct = Product & { images: ProductImage[] };

export type LandingCategory = Category & {
  _count: { products: number };
  products: LandingProduct[];
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
}

export type LandingVariantComponent = (props: LandingPageData) => React.ReactNode;

/**
 * Add a key here whenever a new variant is built, then register it in
 * registry.ts. This is the single place that documents which variants exist.
 */
export type LandingVariantKey = "generic";
