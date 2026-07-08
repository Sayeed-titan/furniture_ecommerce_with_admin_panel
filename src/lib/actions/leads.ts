"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { LeadStatus } from "@prisma/client";

export async function updateLeadStatus(id: string, formData: FormData) {
  const status = String(formData.get("status")) as LeadStatus;

  await prisma.lead.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function updateLeadNotes(id: string, formData: FormData) {
  const notes = String(formData.get("notes") ?? "");
  await prisma.lead.update({ where: { id }, data: { notes: notes || null } });
  revalidatePath("/admin/leads");
}

export async function deleteLead(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.lead.delete({ where: { id } });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}
