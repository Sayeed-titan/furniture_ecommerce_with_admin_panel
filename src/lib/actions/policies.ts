"use server";

import { revalidatePath, refresh } from "next/cache";
import { requirePermission } from "@/lib/authz";
import { setSettings, SETTING_KEYS } from "@/lib/settings";

export type SavePolicyState = { ok?: boolean; error?: string };

export async function savePolicyContent(
  _prev: SavePolicyState,
  formData: FormData
): Promise<SavePolicyState> {
  await requirePermission("settings.edit");

  await setSettings({
    [SETTING_KEYS.termsContent]: String(formData.get("termsContent") ?? ""),
    [SETTING_KEYS.deliveryContent]: String(formData.get("deliveryContent") ?? ""),
    [SETTING_KEYS.returnPolicyContent]: String(formData.get("returnPolicyContent") ?? ""),
    [SETTING_KEYS.warrantyContent]: String(formData.get("warrantyContent") ?? ""),
  });

  revalidatePath("/admin/policies");
  revalidatePath("/terms");
  revalidatePath("/delivery");
  revalidatePath("/returns");
  revalidatePath("/warranty");
  refresh();

  return { ok: true };
}
