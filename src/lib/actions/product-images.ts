"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function revalidate(productId: string) {
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

/** Append an image (by URL) to a product's gallery, at the end. */
export async function addProductImage(productId: string, formData: FormData) {
  const url = String(formData.get("imageUrl") ?? "").trim();
  if (!productId || !url) return;

  const count = await prisma.productImage.count({ where: { productId } });
  await prisma.productImage.create({
    data: { productId, url, position: count },
  });
  revalidate(productId);
}

export async function removeProductImage(formData: FormData) {
  const id = String(formData.get("imageId") ?? "");
  const productId = String(formData.get("productId") ?? "");
  if (!id) return;

  await prisma.productImage.delete({ where: { id } });

  // Re-pack positions so they stay 0..n-1.
  const remaining = await prisma.productImage.findMany({
    where: { productId },
    orderBy: { position: "asc" },
  });
  await Promise.all(
    remaining.map((img, i) =>
      prisma.productImage.update({ where: { id: img.id }, data: { position: i } })
    )
  );
  revalidate(productId);
}

/** Move an image up/down in the ordering by swapping with its neighbour. */
export async function moveProductImage(formData: FormData) {
  const id = String(formData.get("imageId") ?? "");
  const productId = String(formData.get("productId") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!id || !productId) return;

  const images = await prisma.productImage.findMany({
    where: { productId },
    orderBy: { position: "asc" },
  });
  const index = images.findIndex((img) => img.id === id);
  if (index === -1) return;

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= images.length) return;

  await prisma.$transaction([
    prisma.productImage.update({
      where: { id: images[index].id },
      data: { position: swapWith },
    }),
    prisma.productImage.update({
      where: { id: images[swapWith].id },
      data: { position: index },
    }),
  ]);
  revalidate(productId);
}
