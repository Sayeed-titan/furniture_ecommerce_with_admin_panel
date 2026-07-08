import { prisma } from "@/lib/prisma";
import { landingVariants } from "@/components/site/landing/registry";
import { getActiveLandingVariant } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, categories, activeVariant] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
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
          include: { images: { take: 1, orderBy: { position: "asc" } } },
        },
      },
    }),
    getActiveLandingVariant(),
  ]);

  const LandingVariant = landingVariants[activeVariant];

  return <LandingVariant featuredProducts={featuredProducts} categories={categories} />;
}
