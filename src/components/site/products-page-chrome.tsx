"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/use-translation";
import { EmptyState } from "@/components/site/empty-state";
import { Button } from "@/components/ui/button";

/** Small translated leaf components for the products page, which itself
 * must stay a Server Component (it fetches from Prisma). */

export function ProductsHeading() {
  const { t } = useTranslation();
  return <h1 className="text-3xl font-semibold tracking-tight">{t("productsPage.heading")}</h1>;
}

export function ProductsCount({ count }: { count: number }) {
  const { t } = useTranslation();
  return (
    <p className="text-sm text-neutral-600">
      {count} {count === 1 ? t("productsPage.itemsFoundSingular") : t("productsPage.itemsFoundPlural")}
    </p>
  );
}

export function ProductsEmptyState() {
  const { t } = useTranslation();
  return (
    <EmptyState
      title={t("productsPage.emptyTitle")}
      description={t("productsPage.emptyDescription")}
    />
  );
}

export function WishlistEmptyState() {
  const { t } = useTranslation();
  return (
    <EmptyState
      title={t("wishlistPage.emptyTitle")}
      description={t("wishlistPage.emptyDescription")}
      action={
        <Button asChild size="sm" variant="outline">
          <Link href="/products">{t("wishlistPage.browseProducts")}</Link>
        </Button>
      }
    />
  );
}
