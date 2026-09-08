"use server";

import { revalidatePath, refresh } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";
import { Prisma } from "@prisma/client";
import type { RoomType, StockStatus } from "@prisma/client";

export type ProductFormState = { error?: string } | null;

/** True for Prisma's unique-constraint violation (P2002) — e.g. a product
 *  name whose slug collides with an existing one. */
function isUniqueConstraintError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseProductForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));
  const compareAtPriceRaw = String(formData.get("compareAtPrice") ?? "").trim();
  const materialId = String(formData.get("materialId") ?? "");
  const room = String(formData.get("room")) as RoomType;
  const stockStatus = String(formData.get("stockStatus")) as StockStatus;
  const stockQty = Number(formData.get("stockQty") ?? 0);
  const reorderLevel = Number(formData.get("reorderLevel") ?? 5);
  const featured = formData.get("featured") === "on";
  const categoryId = String(formData.get("categoryId"));
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim() || null;
  const dimensions = String(formData.get("dimensions") ?? "").trim() || null;
  const deliveryEstimate = String(formData.get("deliveryEstimate") ?? "").trim() || null;

  return {
    name,
    description,
    price,
    compareAtPrice: compareAtPriceRaw ? Number(compareAtPriceRaw) : null,
    materialId,
    room,
    color,
    dimensions,
    deliveryEstimate,
    stockStatus,
    stockQty,
    reorderLevel,
    featured,
    categoryId,
    imageUrl,
  };
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requirePermission("products.create");
  const data = parseProductForm(formData);

  try {
    await prisma.product.create({
      data: {
        name: data.name,
        slug: slugify(data.name),
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        materialId: data.materialId,
        room: data.room,
        color: data.color,
        dimensions: data.dimensions,
        deliveryEstimate: data.deliveryEstimate,
        stockStatus: data.stockStatus,
        stockQty: data.stockQty,
        reorderLevel: data.reorderLevel,
        featured: data.featured,
        categoryId: data.categoryId,
        images: data.imageUrl
          ? { create: [{ url: data.imageUrl, alt: data.name, position: 0 }] }
          : undefined,
      },
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return { error: `A product named "${data.name}" already exists. Try a different name.` };
    }
    throw err;
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requirePermission("products.edit");
  const data = parseProductForm(formData);

  try {
    // Images are managed separately via the gallery on the edit page
    // (src/lib/actions/product-images.ts), so we don't touch them here.
    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        materialId: data.materialId,
        room: data.room,
        color: data.color,
        dimensions: data.dimensions,
        deliveryEstimate: data.deliveryEstimate,
        stockStatus: data.stockStatus,
        stockQty: data.stockQty,
        reorderLevel: data.reorderLevel,
        featured: data.featured,
        categoryId: data.categoryId,
      },
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return { error: `A product named "${data.name}" already exists. Try a different name.` };
    }
    throw err;
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

/** Adds (or subtracts, for a correction) units to a product's existing
 *  stock — for restocking an existing SKU, not creating a new product.
 *  Also auto-derives stockStatus from the new quantity vs reorderLevel,
 *  unless the product is MADE_TO_ORDER (not quantity-tracked the same way). */
export async function adjustStock(formData: FormData) {
  await requirePermission("products.edit");
  const id = String(formData.get("id") ?? "");
  const delta = Number(formData.get("delta"));
  if (!id || !Number.isFinite(delta) || delta === 0) return;

  const product = await prisma.product.findUnique({
    where: { id },
    select: { stockQty: true, reorderLevel: true, stockStatus: true },
  });
  if (!product) return;

  const newQty = product.stockQty + delta;
  const newStatus: StockStatus =
    product.stockStatus === "MADE_TO_ORDER"
      ? "MADE_TO_ORDER"
      : newQty <= 0
        ? "OUT_OF_STOCK"
        : newQty <= product.reorderLevel
          ? "LOW_STOCK"
          : "IN_STOCK";

  await prisma.product.update({
    where: { id },
    data: { stockQty: newQty, stockStatus: newStatus },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/products");
  refresh();
}

export async function deleteProduct(formData: FormData) {
  await requirePermission("products.delete");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  refresh();
}
