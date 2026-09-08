"use server";

import { revalidatePath, refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";
import type { LeadStatus } from "@prisma/client";

export async function updateLeadStatus(id: string, formData: FormData) {
  await requirePermission("leads.edit");
  const status = String(formData.get("status")) as LeadStatus;

  await prisma.lead.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  refresh();
}

export async function updateLeadNotes(id: string, formData: FormData) {
  await requirePermission("leads.edit");
  const notes = String(formData.get("notes") ?? "");
  await prisma.lead.update({ where: { id }, data: { notes: notes || null } });
  revalidatePath("/admin/leads");
  refresh();
}

export async function deleteLead(formData: FormData) {
  await requirePermission("leads.delete");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.lead.delete({ where: { id } });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  refresh();
}
