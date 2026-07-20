"use server";

import bcrypt from "bcryptjs";
import { signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export type RegisterState = { ok?: boolean; error?: string };

/**
 * Registers a new customer, or "claims" a guest customer record left behind
 * by a previous guest checkout (same email, no password yet).
 */
export async function registerCustomer(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!name || !email) return { error: "Name and email are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords don't match." };

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing?.passwordHash) return { error: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(password, 10);

  if (existing) {
    await prisma.customer.update({
      where: { id: existing.id },
      data: { name, phone: phone || existing.phone, passwordHash },
    });
  } else {
    await prisma.customer.create({
      data: { name, email, phone: phone || null, passwordHash },
    });
  }

  return { ok: true };
}

export async function signOutCustomer() {
  await signOut({ redirectTo: "/account/login" });
}
