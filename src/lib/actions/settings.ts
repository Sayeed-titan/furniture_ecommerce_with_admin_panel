"use server";

import { revalidatePath, refresh } from "next/cache";
import { requirePermission } from "@/lib/authz";
import { setSettings, SETTING_KEYS } from "@/lib/settings";

export type SaveSettingsState = { ok?: boolean; error?: string };

export async function saveSettings(
  _prev: SaveSettingsState,
  formData: FormData
): Promise<SaveSettingsState> {
  await requirePermission("settings.edit");
  await setSettings({
    [SETTING_KEYS.landingVariant]: String(formData.get("landingVariant") ?? ""),
    [SETTING_KEYS.whatsappNumber]: String(formData.get("whatsappNumber") ?? ""),
    [SETTING_KEYS.businessPhone]: String(formData.get("businessPhone") ?? ""),
    [SETTING_KEYS.shopAddress]: String(formData.get("shopAddress") ?? ""),
    [SETTING_KEYS.googleMapsUrl]: String(formData.get("googleMapsUrl") ?? ""),
    [SETTING_KEYS.facebookUrl]: String(formData.get("facebookUrl") ?? ""),
    [SETTING_KEYS.instagramUrl]: String(formData.get("instagramUrl") ?? ""),
    [SETTING_KEYS.youtubeUrl]: String(formData.get("youtubeUrl") ?? ""),
    [SETTING_KEYS.tiktokUrl]: String(formData.get("tiktokUrl") ?? ""),
    [SETTING_KEYS.paymentCodEnabled]: formData.get("paymentCodEnabled") === "on" ? "true" : "false",
    [SETTING_KEYS.paymentOnlineEnabled]: formData.get("paymentOnlineEnabled") === "on" ? "true" : "false",
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout"); // landing variant + WhatsApp button affect the public site
  revalidatePath("/checkout");
  refresh();

  return { ok: true };
}
