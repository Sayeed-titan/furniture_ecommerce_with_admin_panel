"use server";

import { revalidatePath, refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidate() {
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  revalidatePath("/");
  // /admin/categories is force-dynamic (reads straight from Prisma, no Next
  // cache entry to invalidate), so revalidatePath alone won't refresh the
  // current admin session's view — refresh() does.
  refresh();
}

export async function createCategory(formData: FormData) {
  await requirePermission("categories.create");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.category.create({ data: { name, slug: slugify(name) } });
  revalidate();
}

export async function renameCategory(formData: FormData) {
  await requirePermission("categories.edit");
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;

  await prisma.category.update({
    where: { id },
    data: { name, slug: slugify(name) },
  });
  revalidate();
}

/** Delete a category — only when it has no products (products require a category). */
export async function deleteCategory(formData: FormData) {
  await requirePermission("categories.delete");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return; // guarded in UI too; refuse to orphan products

  await prisma.category.delete({ where: { id } });
  revalidate();
}
