"use server";

import { revalidatePath, refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";
import { sanitizePermissions } from "@/lib/permissions";

export async function createRole(formData: FormData) {
  await requirePermission("users.edit");

  const name = String(formData.get("name") ?? "").trim();
  const permissions = sanitizePermissions(formData.getAll("permissions"));
  if (!name) return;

  const existing = await prisma.role.findUnique({ where: { name } });
  if (existing) return;

  await prisma.role.create({ data: { name, permissions } });
  revalidatePath("/admin/roles");
  refresh();
}

export async function updateRole(formData: FormData) {
  await requirePermission("users.edit");

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const permissions = sanitizePermissions(formData.getAll("permissions"));
  if (!id || !name) return;

  const role = await prisma.role.findUnique({ where: { id } });
  if (!role || role.isProtected) return; // the built-in Administrator role can't be edited

  await prisma.role.update({ where: { id }, data: { name, permissions } });
  revalidatePath("/admin/roles");
  refresh();
}

export async function deleteRole(formData: FormData) {
  await requirePermission("users.edit");

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const role = await prisma.role.findUnique({ where: { id }, include: { _count: { select: { users: true } } } });
  if (!role || role.isProtected) return;
  if (role._count.users > 0) return; // reassign its users to another role first

  await prisma.role.delete({ where: { id } });
  revalidatePath("/admin/roles");
  refresh();
}
