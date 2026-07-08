"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { Role } from "@prisma/client";

export async function createUser(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "STAFF") as Role;

  if (!name || !email || password.length < 8) return;

  // Ignore duplicates gracefully (email is unique).
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) return;

  await prisma.adminUser.create({
    data: { name, email, role, passwordHash: await bcrypt.hash(password, 10) },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const [session, target] = await Promise.all([
    auth(),
    prisma.adminUser.findUnique({ where: { id } }),
  ]);
  if (!target) return;

  // Can't delete yourself.
  if (session?.user?.email && target.email === session.user.email) return;

  // Can't delete the last remaining admin.
  if (target.role === "ADMIN") {
    const adminCount = await prisma.adminUser.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) return;
  }

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/users");
}
