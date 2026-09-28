"use server";

import { revalidatePath, refresh } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";
import { Prisma } from "@prisma/client";
import type { RoomType } from "@prisma/client";
import { deriveStockStatus } from "@/lib/stock";
import { getAllSettings, SETTING_KEYS } from "@/lib/settings";
import { renderProductCode, DEFAULT_PRODUCT_CODE_PATTERN, DEFAULT_PRODUCT_CODE_BRAND } from "@/lib/product-code";

/** Auto-generates a product code from the Settings pattern, atomically
 *  incrementing the category's running sequence — only called at create
 *  time when the admin left the code field blank; a manual code always
 *  wins (see parseProductForm). */
async function generateProductCode(categoryId: string): Promise<string> {
  const [settings, category] = await Promise.all([
    getAllSettings(),
    prisma.category.update({
      where: { id: categoryId },
      data: { lastSeq: { increment: 1 } },
      select: { shortCode: true, lastSeq: true },
    }),
  ]);
  const pattern = settings[SETTING_KEYS.productCodePattern] || DEFAULT_PRODUCT_CODE_PATTERN;
  const brand = settings[SETTING_KEYS.productCodeBrand] || DEFAULT_PRODUCT_CODE_BRAND;
  return renderProductCode(pattern, { brand, categoryShortCode: category.shortCode, seq: category.lastSeq });
}

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
  const stockQty = Number(formData.get("stockQty") ?? 0);
  const reorderLevel = Number(formData.get("reorderLevel") ?? 5);
  const madeToOrder = formData.get("madeToOrder") === "on";
  const stockStatus = deriveStockStatus(stockQty, reorderLevel, madeToOrder);
  const featured = formData.get("featured") === "on";
  const isTrending = formData.get("isTrending") === "on";
  const categoryId = String(formData.get("categoryId"));
  const additionalMaterialIds = formData
    .getAll("materialIds")
    .map(String)
    .filter((id) => id && id !== materialId);
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim() || null;
  const dimensions = String(formData.get("dimensions") ?? "").trim() || null;
  const deliveryEstimate = String(formData.get("deliveryEstimate") ?? "").trim() || null;
  const code = String(formData.get("code") ?? "").trim() || null;

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
    isTrending,
    categoryId,
    imageUrl,
    code,
    additionalMaterialIds,
  };
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requirePermission("products.create");
  const data = parseProductForm(formData);

  try {
    const code = data.code ?? (await generateProductCode(data.categoryId));
    await prisma.product.create({
      data: {
        name: data.name,
        slug: slugify(data.name),
        code,
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
        isTrending: data.isTrending,
        categoryId: data.categoryId,
        materials: { connect: data.additionalMaterialIds.map((id) => ({ id })) },
        images: data.imageUrl
          ? { create: [{ url: data.imageUrl, alt: data.name, position: 0 }] }
          : undefined,
      },
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return {
        error: `A product named "${data.name}"${data.code ? ` or code "${data.code}"` : ""} already exists. Try a different one.`,
      };
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
        code: data.code,
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
        isTrending: data.isTrending,
        categoryId: data.categoryId,
        materials: { set: data.additionalMaterialIds.map((id) => ({ id })) },
      },
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return {
        error: `A product named "${data.name}"${data.code ? ` or code "${data.code}"` : ""} already exists. Try a different one.`,
      };
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
  const newStatus = deriveStockStatus(newQty, product.reorderLevel, product.stockStatus === "MADE_TO_ORDER");

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
