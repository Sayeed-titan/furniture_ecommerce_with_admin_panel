"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getRolePermissions, hasPermission } from "@/lib/authz";
import { sendEmail, escapeHtml } from "@/lib/email";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function siteUrl() {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

function hashToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

/** Creates a reset token for a customer and emails them the link. Shared by
 *  both the customer's own "forgot password" request and an admin forcing a
 *  reset on a customer's behalf — same secure flow either way, so no one
 *  (including admin) ever sees or sets the actual password. */
async function issueResetLink(customer: { id: string; name: string; email: string }) {
  const rawToken = crypto.randomBytes(32).toString("hex");

  await prisma.passwordResetToken.create({
    data: {
      customerId: customer.id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });

  const link = `${siteUrl()}/account/reset-password/${rawToken}`;

  return sendEmail({
    to: customer.email,
    subject: "Reset your password",
    html: `
      <p>Hi ${escapeHtml(customer.name)},</p>
      <p>Click the link below to set a new password. This link expires in 1 hour and can only be used once.</p>
      <p><a href="${link}">${link}</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}

export type RequestResetState = { sent?: boolean; error?: string };

/** Customer self-service "forgot password". Always returns a generic
 *  success message regardless of whether the email exists, so this can't be
 *  used to enumerate registered accounts. */
export async function requestPasswordReset(
  _prev: RequestResetState,
  formData: FormData
): Promise<RequestResetState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Enter your email address." };

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (customer?.passwordHash) {
    await issueResetLink(customer);
  }

  // Same message whether or not the account exists.
  return { sent: true };
}

export type ResetPasswordState = { ok?: boolean; error?: string };

/** Consumes a reset token and sets a new password. */
export async function resetPassword(
  rawToken: string,
  _prev: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords don't match." };

  const tokenHash = hashToken(rawToken);
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }

  await prisma.$transaction([
    prisma.customer.update({
      where: { id: resetToken.customerId },
      data: { passwordHash: await bcrypt.hash(password, 10) },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
    // Invalidate any other outstanding links for this customer.
    prisma.passwordResetToken.updateMany({
      where: { customerId: resetToken.customerId, usedAt: null, id: { not: resetToken.id } },
      data: { usedAt: new Date() },
    }),
  ]);

  return { ok: true };
}

export type AdminForceResetState = { sent?: boolean; error?: string };

/** Admin-triggered version for when a customer contacts support locked out
 *  of their account — sends the same secure reset link, admin never sees or
 *  sets a password. */
export async function adminSendPasswordReset(
  _prev: AdminForceResetState,
  formData: FormData
): Promise<AdminForceResetState> {
  const session = await auth();
  const user = session?.user as { userType?: string; roleId?: string } | undefined;
  if (user?.userType !== "admin" || !user.roleId) {
    return { error: "Not authorized." };
  }
  const permissions = await getRolePermissions(user.roleId);
  if (!hasPermission(permissions, "customers.edit")) {
    return { error: "Not authorized." };
  }

  const customerId = String(formData.get("customerId") ?? "");
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer) return { error: "Customer not found." };
  if (!customer.passwordHash) {
    return { error: `${customer.name} hasn't set a password yet (guest checkout only).` };
  }

  const sent = await issueResetLink(customer);
  revalidatePath("/admin/customers");
  return sent ? { sent: true } : { error: "Email isn't configured — the link couldn't be sent." };
}
