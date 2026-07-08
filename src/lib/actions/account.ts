"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ChangePasswordState = { ok?: boolean; error?: string };

/** Change the signed-in admin's own password (requires the current one). */
export async function changePassword(
  _prev: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await auth();
  if (!session?.user?.email) return { error: "You're not signed in." };

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (next.length < 8) return { error: "New password must be at least 8 characters." };
  if (next !== confirm) return { error: "New passwords don't match." };

  const user = await prisma.adminUser.findUnique({ where: { email: session.user.email } });
  if (!user) return { error: "Account not found." };

  const valid = await bcrypt.compare(current, user.passwordHash);
  if (!valid) return { error: "Your current password is incorrect." };

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(next, 10) },
  });

  return { ok: true };
}
