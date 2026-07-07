"use client";

import { useTranslation } from "@/lib/i18n/use-translation";

/**
 * Takes only the plain status string (not the whole product, which carries
 * a Prisma Decimal price field that can't cross the client boundary) so
 * ProductCard and other server-rendered callers can stay Server Components.
 */
export function StockLabel({ status }: { status: string }) {
  const { t } = useTranslation();
  return <>{t(`stock.${status}`)}</>;
}
