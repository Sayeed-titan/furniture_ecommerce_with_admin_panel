import { prisma } from "@/lib/prisma";
import { landingVariants } from "@/components/site/landing/registry";
import { getActiveLandingVariant, getAllSettings, SETTING_KEYS } from "@/lib/settings";
import type { HeroContent } from "@/components/site/landing/types";

export const dynamic = "force-dynamic";

function parseSlides(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, categories, materials, activeVariant, settings] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      include: {
        images: { where: { type: "IMAGE" }, orderBy: { position: "asc" }, take: 1 },
        material: true,
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
        products: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            images: { where: { type: "IMAGE" }, take: 1, orderBy: { position: "asc" } },
            material: true,
          },
        },
      },
    }),
    prisma.material.findMany({ orderBy: { name: "asc" } }),
    getActiveLandingVariant(),
    getAllSettings(),
  ]);

  const LandingVariant = landingVariants[activeVariant];

  const heroContent: HeroContent = {
    eyebrow: settings[SETTING_KEYS.heroEyebrow] || null,
    headline: settings[SETTING_KEYS.heroHeadline] || null,
    subtitle: settings[SETTING_KEYS.heroSubtitle] || null,
    primaryLabel: settings[SETTING_KEYS.heroPrimaryLabel] || null,
    primaryHref: settings[SETTING_KEYS.heroPrimaryHref] || null,
    secondaryLabel: settings[SETTING_KEYS.heroSecondaryLabel] || null,
    secondaryHref: settings[SETTING_KEYS.heroSecondaryHref] || null,
  };

  return (
    <LandingVariant
      featuredProducts={featuredProducts}
      categories={categories}
      materials={materials}
      heroContent={heroContent}
      heroSlides={parseSlides(settings[SETTING_KEYS.heroSlidesJson])}
    />
  );
}
