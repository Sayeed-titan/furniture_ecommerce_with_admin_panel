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

/** shortCode uniqueness is enforced here, not a DB constraint (see the
 *  schema comment) — falls back to the name's first two letters when left
 *  blank, and silently disambiguates ("OC" -> "OC2") on a collision rather
 *  than erroring, since category creation/rename here has no error-toast
 *  path today; the admin can always edit it again afterward. */
async function resolveShortCode(name: string, submitted: string, excludeId?: string): Promise<string> {
  const base = (submitted || name.slice(0, 2)).trim().toUpperCase().slice(0, 6) || "XX";
  let candidate = base;
  let suffix = 2;
  while (
    await prisma.category.findFirst({
      where: { shortCode: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    })
  ) {
    candidate = `${base}${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export async function createCategory(formData: FormData) {
  await requirePermission("categories.create");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const shortCode = await resolveShortCode(name, String(formData.get("shortCode") ?? ""));

  await prisma.category.create({ data: { name, slug: slugify(name), shortCode } });
  revalidate();
}

export async function renameCategory(formData: FormData) {
  await requirePermission("categories.edit");
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;
  const shortCode = await resolveShortCode(name, String(formData.get("shortCode") ?? ""), id);
  const showOnHome = formData.get("showOnHome") === "on";
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;

  await prisma.category.update({
    where: { id },
    data: { name, slug: slugify(name), shortCode, showOnHome, imageUrl },
  });
  revalidate();
}

/** Persists a new homepage tile order — called directly (not via a form)
 *  from CategoryList after a drag-and-drop or an Up/Down button click. */
export async function reorderCategories(orderedIds: string[]) {
  await requirePermission("categories.edit");
  await Promise.all(
    orderedIds.map((id, index) => prisma.category.update({ where: { id }, data: { order: index } }))
  );
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
