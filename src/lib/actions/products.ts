"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { MaterialType, RoomType, StockStatus } from "@prisma/client";

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
  const material = String(formData.get("material")) as MaterialType;
  const room = String(formData.get("room")) as RoomType;
  const stockStatus = String(formData.get("stockStatus")) as StockStatus;
  const stockQty = Number(formData.get("stockQty") ?? 0);
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
    material,
    room,
    color,
    dimensions,
    deliveryEstimate,
    stockStatus,
    stockQty,
    featured,
    categoryId,
    imageUrl,
  };
}

export async function createProduct(formData: FormData) {
  const data = parseProductForm(formData);

  await prisma.product.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      material: data.material,
      room: data.room,
      color: data.color,
      dimensions: data.dimensions,
      deliveryEstimate: data.deliveryEstimate,
      stockStatus: data.stockStatus,
      stockQty: data.stockQty,
      featured: data.featured,
      categoryId: data.categoryId,
      images: data.imageUrl
        ? { create: [{ url: data.imageUrl, alt: data.name, position: 0 }] }
        : undefined,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const data = parseProductForm(formData);

  // Images are managed separately via the gallery on the edit page
  // (src/lib/actions/product-images.ts), so we don't touch them here.
  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      material: data.material,
      room: data.room,
      color: data.color,
      dimensions: data.dimensions,
      deliveryEstimate: data.deliveryEstimate,
      stockStatus: data.stockStatus,
      stockQty: data.stockQty,
      featured: data.featured,
      categoryId: data.categoryId,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}
