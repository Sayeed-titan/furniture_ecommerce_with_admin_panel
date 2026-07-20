"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireCustomerId() {
  const session = await auth();
  const user = session?.user as { id?: string; userType?: string } | undefined;
  if (user?.userType !== "customer" || !user.id) throw new Error("Not signed in.");
  return user.id;
}

function parseAddressForm(formData: FormData) {
  return {
    label: String(formData.get("label") ?? "").trim() || null,
    recipientName: String(formData.get("recipientName") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    line1: String(formData.get("line1") ?? "").trim(),
    line2: String(formData.get("line2") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim(),
    area: String(formData.get("area") ?? "").trim() || null,
    postCode: String(formData.get("postCode") ?? "").trim() || null,
    isDefault: formData.get("isDefault") === "on",
  };
}

export async function createAddress(formData: FormData) {
  const customerId = await requireCustomerId();
  const data = parseAddressForm(formData);

  if (data.isDefault) {
    await prisma.address.updateMany({ where: { customerId }, data: { isDefault: false } });
  }

  await prisma.address.create({ data: { ...data, customerId } });
  revalidatePath("/account");
}

export async function updateAddress(id: string, formData: FormData) {
  const customerId = await requireCustomerId();
  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing || existing.customerId !== customerId) throw new Error("Address not found.");

  const data = parseAddressForm(formData);

  if (data.isDefault) {
    await prisma.address.updateMany({ where: { customerId }, data: { isDefault: false } });
  }

  await prisma.address.update({ where: { id }, data });
  revalidatePath("/account");
}

export async function deleteAddress(formData: FormData) {
  const customerId = await requireCustomerId();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing || existing.customerId !== customerId) throw new Error("Address not found.");

  await prisma.address.delete({ where: { id } });
  revalidatePath("/account");
}
