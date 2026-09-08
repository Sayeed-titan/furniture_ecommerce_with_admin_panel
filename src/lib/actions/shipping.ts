"use server";

import { revalidatePath, refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";

function revalidate() {
  revalidatePath("/admin/shipping");
  revalidatePath("/checkout");
  refresh();
}

export async function createShippingZone(formData: FormData) {
  await requirePermission("shipping.create");
  const name = String(formData.get("name") ?? "").trim();
  const fee = Number(formData.get("fee") ?? 0);
  if (!name || !Number.isFinite(fee) || fee < 0) return;

  const isFirst = (await prisma.shippingZone.count()) === 0;
  await prisma.shippingZone.create({ data: { name, fee, isDefault: isFirst } });
  revalidate();
}

export async function updateShippingZone(formData: FormData) {
  await requirePermission("shipping.edit");
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const fee = Number(formData.get("fee") ?? 0);
  if (!id || !name || !Number.isFinite(fee) || fee < 0) return;

  await prisma.shippingZone.update({ where: { id }, data: { name, fee } });
  revalidate();
}

/** Exactly one zone is default at a time — unset every other zone first. */
export async function setDefaultShippingZone(formData: FormData) {
  await requirePermission("shipping.edit");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.$transaction([
    prisma.shippingZone.updateMany({ where: { isDefault: true }, data: { isDefault: false } }),
    prisma.shippingZone.update({ where: { id }, data: { isDefault: true } }),
  ]);
  revalidate();
}

/** Delete a zone — only when no order currently references it. */
export async function deleteShippingZone(formData: FormData) {
  await requirePermission("shipping.delete");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const count = await prisma.order.count({ where: { shippingZoneId: id } });
  if (count > 0) return; // guarded in UI too; refuse to orphan order history

  await prisma.shippingZone.delete({ where: { id } });
  revalidate();
}
