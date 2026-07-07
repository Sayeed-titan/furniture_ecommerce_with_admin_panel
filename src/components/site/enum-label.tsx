"use client";

import { useTranslation } from "@/lib/i18n/use-translation";

/**
 * Translates a plain enum value (material/room/stock status) via the
 * dictionary. Takes only the string value — never the full product object,
 * which carries a Prisma Decimal price field that can't cross the client
 * boundary from a Server Component parent.
 */
export function EnumLabel({ group, value }: { group: "materials" | "rooms" | "stock"; value: string }) {
  const { t } = useTranslation();
  return <>{t(`${group}.${value}`)}</>;
}
