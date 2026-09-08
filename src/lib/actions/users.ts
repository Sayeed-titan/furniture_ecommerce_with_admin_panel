"use server";

import bcrypt from "bcryptjs";
import { revalidatePath, refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";

export async function createUser(formData: FormData) {
  await requirePermission("users.create");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const roleId = String(formData.get("roleId") ?? "");

  if (!name || !email || !roleId || password.length < 8) return;

  // Ignore duplicates gracefully (email is unique).
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) return;

  await prisma.adminUser.create({
    data: { name, email, roleId, passwordHash: await bcrypt.hash(password, 10) },
  });

  revalidatePath("/admin/users");
  refresh();
}

export async function deleteUser(formData: FormData) {
  const { session } = await requirePermission("users.delete");

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const target = await prisma.adminUser.findUnique({ where: { id }, include: { role: true } });
  if (!target) return;

  // Can't delete yourself.
  if (session?.user?.email && target.email === session.user.email) return;

  // Can't delete the last user in a protected role (e.g. the last Administrator).
  if (target.role.isProtected) {
    const protectedCount = await prisma.adminUser.count({ where: { roleId: target.roleId } });
    if (protectedCount <= 1) return;
  }

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/users");
  refresh();
}
