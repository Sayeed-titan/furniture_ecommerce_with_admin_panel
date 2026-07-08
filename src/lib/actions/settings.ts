"use server";

import { revalidatePath } from "next/cache";
import { setSettings, SETTING_KEYS } from "@/lib/settings";

export async function saveSettings(formData: FormData) {
  await setSettings({
    [SETTING_KEYS.landingVariant]: String(formData.get("landingVariant") ?? ""),
    [SETTING_KEYS.whatsappNumber]: String(formData.get("whatsappNumber") ?? ""),
    [SETTING_KEYS.businessPhone]: String(formData.get("businessPhone") ?? ""),
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout"); // landing variant + WhatsApp button affect the public site
}
