"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/authz";
import { createBackup, deleteBackupFile } from "@/lib/backup";

export async function createBackupAction() {
  await requirePermission("backup.create");
  await createBackup();
  revalidatePath("/admin/backup");
}

export async function deleteBackupAction(formData: FormData) {
  await requirePermission("backup.delete");
  const name = String(formData.get("name") ?? "");
  if (!name) return;

  await deleteBackupFile(name);
  revalidatePath("/admin/backup");
}
