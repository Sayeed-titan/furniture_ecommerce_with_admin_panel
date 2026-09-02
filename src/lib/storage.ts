/**
 * Server-only product-image uploads to local disk, under public/uploads/products.
 * Next.js serves the public/ directory as-is (dev and `next start` alike), so a
 * file written here is immediately reachable at the returned URL — no separate
 * static-file route needed.
 *
 * Production note (Hostinger): this directory must survive redeploys — make
 * sure whatever deploy process is used does not wipe/replace public/uploads.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const PUBLIC_PATH = "/uploads/products";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

function extensionFor(contentType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/gif": "gif",
  };
  return map[contentType] ?? "bin";
}

export async function uploadProductImage(file: File): Promise<{ url: string }> {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Unsupported image type. Use JPG, PNG, WebP, AVIF, or GIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image is too large (max 8 MB).");
  }

  const filename = `${crypto.randomUUID()}.${extensionFor(file.type)}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()));

  return { url: `${PUBLIC_PATH}/${filename}` };
}
