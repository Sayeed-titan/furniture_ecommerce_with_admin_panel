"use server";

import { revalidatePath, refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";

function revalidate() {
  revalidatePath("/admin/materials");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  refresh();
}

export async function createMaterial(formData: FormData) {
  await requirePermission("materials.create");
  const name = String(formData.get("name") ?? "").trim();
  const nameBn = String(formData.get("nameBn") ?? "").trim() || null;
  if (!name) return;

  await prisma.material.create({ data: { name, nameBn } });
  revalidate();
}

export async function renameMaterial(formData: FormData) {
  await requirePermission("materials.edit");
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const nameBn = String(formData.get("nameBn") ?? "").trim() || null;
  if (!id || !name) return;

  await prisma.material.update({ where: { id }, data: { name, nameBn } });
  revalidate();
}

/** Delete a material — only when no product currently uses it. */
export async function deleteMaterial(formData: FormData) {
  await requirePermission("materials.delete");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const count = await prisma.product.count({ where: { materialId: id } });
  if (count > 0) return; // guarded in UI too; refuse to orphan products

  await prisma.material.delete({ where: { id } });
  revalidate();
}
