"use client";

import { useTranslation } from "@/lib/i18n/use-translation";

/** Shows a Material's Bangla name when the site is in Bangla and one is set, English otherwise. */
export function MaterialLabel({ name, nameBn }: { name: string; nameBn?: string | null }) {
  const { locale } = useTranslation();
  return <>{locale === "bn" && nameBn ? nameBn : name}</>;
}
