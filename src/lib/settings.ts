import { prisma } from "@/lib/prisma";
import { landingVariants } from "@/components/site/landing/registry";
import { ACTIVE_LANDING_VARIANT } from "@/config/landing";
import type { LandingVariantKey } from "@/components/site/landing/types";

/**
 * Known setting keys. Anything the admin can change lives here.
 */
export const SETTING_KEYS = {
  landingVariant: "landing_variant",
  whatsappNumber: "whatsapp_number",
  businessPhone: "business_phone",
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

/** Read every setting as a plain map (missing keys simply absent). */
export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

export async function getSetting(key: SettingKey): Promise<string | null> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    return row?.value ?? null;
  } catch {
    // Settings are non-critical; never let a DB hiccup break the page/build.
    return null;
  }
}

/** Upsert a batch of settings. Empty-string values delete the key. */
export async function setSettings(entries: Record<string, string>): Promise<void> {
  await Promise.all(
    Object.entries(entries).map(([key, value]) =>
      value.trim()
        ? prisma.siteSetting.upsert({
            where: { key },
            update: { value: value.trim() },
            create: { key, value: value.trim() },
          })
        : prisma.siteSetting.deleteMany({ where: { key } })
    )
  );
}

/**
 * The live landing variant: the admin-chosen one if valid, otherwise the
 * compile-time default from config/landing.ts.
 */
export async function getActiveLandingVariant(): Promise<LandingVariantKey> {
  const stored = await getSetting(SETTING_KEYS.landingVariant);
  if (stored && stored in landingVariants) return stored as LandingVariantKey;
  return ACTIVE_LANDING_VARIANT;
}
