"use server";

import { revalidatePath, refresh } from "next/cache";
import { requirePermission } from "@/lib/authz";
import { setSettings, SETTING_KEYS } from "@/lib/settings";

/** Saves (or clears, if url is empty) an uploaded brand asset's URL — called
 *  immediately after a successful upload, not tied to the main Settings form. */
export async function saveBrandAsset(kind: "icon" | "logo", url: string) {
  await requirePermission("settings.edit");

  const key = kind === "icon" ? SETTING_KEYS.brandIconUrl : SETTING_KEYS.brandLogoUrl;
  await setSettings({ [key]: url });

  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/settings");
  refresh();
}
